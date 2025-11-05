import { UserSequelize } from "@/infrastructure/database/models";
import { UserType } from "@/shared/enum";

export class UserEntity {
    constructor(
        public id: number,
        public email: string,
        public passwordHash: string | null,
        public type: UserType,
        public googleUuid: string | null,
        public displayName: string | null,
        public photoUrl: string | null,
        public createdAt?: Date,
        public updatedAt?: Date,
        public deletedAt?: Date | null
    ){}

    static fromRow(row: UserSequelize): UserEntity {
        return new UserEntity(
            row.id,
            row.email,
            row.passwordHash ?? null,
            row.type,
            row.googleUuid ?? null,
            row.displayName ?? null,
            row.photoUrl ?? null,
            row.createdAt,
            row.updatedAt,
            row.deletedAt
        );
    }
}