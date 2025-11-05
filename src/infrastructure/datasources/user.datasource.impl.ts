import { UserDatasource } from "@/domain/datasources/user.datasource";
import { UserEntity } from "@/domain/entities/user.entity";
import { UserDto } from "@/domain/dtos/user.dto";
import { CustomError } from "@/shared/custom.error";
import { UserSequelize } from "@/infrastructure/database/models";
import bcrypt from "bcryptjs";
import { UserType } from "@/shared/enum";

export class UserDatasourceImpl implements UserDatasource {
    async findById(id: number): Promise<UserEntity> {
        try {
            const userRow = await UserSequelize.findByPk(id);
            if (!userRow) {
                throw CustomError.notFound(`User with id ${id} not found`);
            }
            return UserEntity.fromRow(userRow);
        } catch (error) {
            if (error instanceof CustomError) {
                throw error;
            }
            throw CustomError.internalServer(`Unexpected error in UserDatasourceImpl.findById: ${error}`);
        }
    }

    async findByEmail(email: string): Promise<UserEntity | null> {
        try {
            const userRow = await UserSequelize.findOne({
                where: { email }
            });

            if (!userRow) {
                return null;
            }

            return UserEntity.fromRow(userRow);
        } catch (error) {
            throw CustomError.internalServer(`Unexpected error in UserDatasourceImpl.findByEmail: ${error}`);
        }
    }

    async findByGoogleUuid(googleUuid: string): Promise<UserEntity | null> {
        try {
            const userRow = await UserSequelize.findOne({
                where: { googleUuid: googleUuid }
            });

            if (!userRow) {
                return null;
            }

            return UserEntity.fromRow(userRow);
        } catch (error) {
            throw CustomError.internalServer(`Unexpected error in UserDatasourceImpl.findByGoogleUuid: ${error}`);
        }
    }

    async findOrCreate(user: UserDto): Promise<UserEntity> {
        try {
            // Si viene con googleUuid, es login con Google
            if (user.googleUuid) {
                return await this.findOrCreateGoogleUser(user);
            }

            // Si viene con password, es registro tradicional
            if (user.passwordHash) {
                return await this.createLocalUser(user);
            }

            throw CustomError.badRequest('Invalid user data: either googleUuid or password is required'); // ✅ CAMBIO

        } catch (error) {
            if (error instanceof CustomError) {
                throw error;
            }
            throw CustomError.internalServer(`Unexpected error in UserDatasourceImpl.findOrCreate: ${error}`);
        }
    }

    private async findOrCreateGoogleUser(user: UserDto): Promise<UserEntity> {
        try {
            const existingUser = await this.findByGoogleUuid(user.googleUuid!);

            if (existingUser) {
                // Usuario ya existe, actualizar datos si es necesario
                const userRow = await UserSequelize.findByPk(existingUser.id);
                if (userRow) {
                    await userRow.update({
                        displayName: user.displayName || userRow.displayName,
                        photoUrl: user.photoUrl || userRow.photoUrl,
                        updatedAt: new Date()
                    });
                    return UserEntity.fromRow(userRow);
                }
            }

            // Crear nuevo usuario con Google
            const newUserRow = await UserSequelize.create({
                email: user.email,
                googleUuid: user.googleUuid,
                displayName: user.displayName,
                photoUrl: user.photoUrl,
                type: UserType.GOOGLE,
                passwordHash: null
            });

            return UserEntity.fromRow(newUserRow);

        } catch (error) {
            if (error instanceof CustomError) {
                throw error;
            }
            throw CustomError.internalServer(`Error creating/finding Google user: ${error}`);
        }
    }

    private async createLocalUser(user: UserDto): Promise<UserEntity> {
        try {
            const existingUser = await this.findByEmail(user.email);

            if (existingUser) {
                throw CustomError.badRequest('User already exists with this email'); // ✅ CAMBIO
            }

            // Hash de la contraseña
            const passwordHash = await bcrypt.hash(user.passwordHash!, 10);

            // Crear nuevo usuario con email/password
            const newUserRow = await UserSequelize.create({
                email: user.email,
                passwordHash: passwordHash,
                displayName: user.displayName || user.email.split('@')[0],
                type: UserType.LOCAL,
                googleUuid: null
            });

            return UserEntity.fromRow(newUserRow);

        } catch (error) {
            if (error instanceof CustomError) {
                throw error;
            }
            throw CustomError.internalServer(`Error creating local user: ${error}`);
        }
    }

    async validatePassword(email: string, password: string): Promise<UserEntity> {
        try {
            const userRow = await UserSequelize.findOne({
                where: { email }
            });

            if (!userRow) {
                throw CustomError.unauthorized('Invalid credentials'); // ✅ CAMBIO
            }

            if (!userRow.passwordHash) {
                throw CustomError.badRequest('This account uses Google Sign-In'); // ✅ CAMBIO
            }

            const isValidPassword = await bcrypt.compare(password, userRow.passwordHash);

            if (!isValidPassword) {
                throw CustomError.unauthorized('Invalid credentials'); // ✅ CAMBIO
            }

            return UserEntity.fromRow(userRow);

        } catch (error) {
            if (error instanceof CustomError) {
                throw error;
            }
            throw CustomError.internalServer(`Unexpected error in UserDatasourceImpl.validatePassword: ${error}`);
        }
    }
}