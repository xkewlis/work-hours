import { UserEntity } from "@/domain/entities/user.entity";
import { UserDto } from "../dtos/user.dto";

export abstract class UserDatasource {
    abstract findById(id: number): Promise<UserEntity>;
    abstract findByEmail(email: string): Promise<UserEntity | null>;
    abstract findByGoogleUuid(googleUuid: string): Promise<UserEntity | null>;
    abstract findOrCreate(user: UserDto): Promise<UserEntity>;
}