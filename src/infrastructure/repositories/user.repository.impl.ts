import { UserRepository } from "@/domain/repositories/user.repository";
import { UserDatasourceImpl } from "../datasources/user.datasource.impl";
import { UserDto } from "@/domain/dtos/user.dto";
import { UserEntity } from "@/domain/entities/user.entity";

export class UserRepositoryImpl implements UserRepository {
    constructor(
        private readonly userDatasource: UserDatasourceImpl = new UserDatasourceImpl()
    ) {}

    async findOrCreate(userDto: UserDto): Promise<UserEntity> {
        return this.userDatasource.findOrCreate(userDto);
    }

    async validatePassword(email: string, password: string): Promise<UserEntity> {
        return this.userDatasource.validatePassword(email, password);
    }
}