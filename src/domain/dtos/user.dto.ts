import { UserType } from "@/shared/enum";

export class UserDto {
    constructor(
        public email: string,
        public passwordHash: string | null = null,
        public googleUuid: string | null = null,
        public displayName: string | null = null,
        public photoUrl: string | null = null,
        public id?: number,
        public type?: UserType,
        public createdAt?: Date,
        public updatedAt?: Date,
        public deletedAt?: Date | null
    ) {}

    static create(object: { [key: string]: any }): [string?, UserDto?] {
        const { id, email, passwordHash, type, googleUuid, displayName, photoUrl, createdAt, updatedAt, deletedAt } = object;
        const errors: string[] = [];
        
        if (!id) errors.push("id is required");
        if (!email) errors.push("email is required");
        if (!type) errors.push("type is required");
        
        if (errors.length > 0) return [errors.join(", "), undefined];
        
        return [undefined, new UserDto(
            email,
            passwordHash,
            googleUuid,
            displayName,
            photoUrl,
            id,
            type,
            createdAt,
            updatedAt,
            deletedAt
        )];
    }

    static fromRequest(object: { [key: string]: any }): [string?, UserDto?] {
        const { email, passwordHash, googleUuid, displayName, photoUrl } = object;
        const errors: string[] = [];

        // Validar email
        if (!email || typeof email !== 'string') {
            errors.push("email is required and must be a string");
        }

        // Validar formato de email
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (email && !emailRegex.test(email)) {
            errors.push("invalid email format");
        }

        // Validar que tenga password O googleUuid (no ambos, no ninguno)
        if (!passwordHash && !googleUuid) {
            errors.push("either passwordHash or googleUuid is required");
        }

        if (passwordHash && googleUuid) {
            errors.push("cannot provide both passwordHash and googleUuid");
        }

        // Validar longitud de password
        if (passwordHash && passwordHash.length < 6) {
            errors.push("password must be at least 6 characters");
        }

        if (errors.length > 0) {
            return [errors.join(", "), undefined];
        }

        return [undefined, new UserDto(
            email.toLowerCase().trim(),
            passwordHash || null,
            googleUuid || null,
            displayName || null,
            photoUrl || null
        )];
    }
}