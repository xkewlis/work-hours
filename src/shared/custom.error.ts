export class CustomError extends Error {
    constructor(
        public readonly message: string,
        public readonly statusCode: number = 500
    ) {
        super(message);
    }

    static notFound(message: string) {
        return new CustomError('Not found error: ' + message, 404);
    }

    static internalServer(message?: string) {
        return new CustomError('Internal error: ' + message, 500);
    }

    static sequelizeError(message: string) {
        return new CustomError('Sequelize error detected: ' + message, 500);
    }

    static badRequest(message: string) {
        return new CustomError('Bad request: ' + message, 400);
    }

    static unauthorized(message: string) {
        return new CustomError('Unauthorized: ' + message, 401);
    }

    static forbidden(message: string) {
        return new CustomError('Forbidden: ' + message, 403);
    }

    static conflict(message: string) {
        return new CustomError('Conflict: ' + message, 409);
    }

    static throwAnError(error: any): void {
        if (error instanceof CustomError) {
            throw error;
        }
        throw this.internalServer(error.message);
    }
}