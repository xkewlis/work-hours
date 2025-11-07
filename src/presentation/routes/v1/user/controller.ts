import { UserDto } from "@/domain/dtos/user.dto";
import { UserRepositoryImpl } from "@/infrastructure/repositories/user.repository.impl";
import { Context } from "hono";

export default class UserController {
    private readonly userRepository = new UserRepositoryImpl();

    public register = async (c: Context) => {
        try {
            const body = await c.req.json();

            const [error, dto] = UserDto.fromRequest(body);
            if (error) {
                return c.json({
                    success: false,
                    error: 'Invalid user data',
                    details: error
                }, 400);
            }

            if (!dto) {
                return c.json({
                    success: false,
                    error: 'User data is required'
                }, 400);
            }

            // Verificar que venga con password
            if (!dto.passwordHash) {
                return c.json({
                    success: false,
                    error: 'Password is required for registration'
                }, 400);
            }

            const user = await this.userRepository.findOrCreate(dto);

            return c.json({
                success: true,
                data: user,
                message: 'User registered successfully'
            }, 201);

        } catch (error) {
            console.log(error);
            return c.json({ error: 'Internal server error', message: error }, 500);
        }
    }

    public googleAuth = async (c: Context) => {
        try {
            const body = await c.req.json();

            const [error, dto] = UserDto.fromRequest(body);
            if (error) {
                return c.json({
                    success: false,
                    error: 'Invalid user data',
                    details: error
                }, 400);
            }
            if (!dto) {
                return c.json({
                    success: false,
                    error: 'User data is required'
                }, 400);
            }
            // Verificar que venga con googleUuid
            if (!dto.googleUuid) {
                return c.json({
                    success: false,
                    error: 'Google UUID is required'
                }, 400);
            }

            const user = await this.userRepository.findOrCreate(dto);

            return c.json({
                success: true,
                data: user,
                message: 'Google authentication successful'
            }, 200);

        } catch (error) {
            console.log(error);
            return c.json({ error: 'Internal server error', message: error }, 500);
        }
    }

    public login = async (c: Context) => {
        try {
            const { email, password } = await c.req.json();

            if (!email || !password) {
                return c.json({
                    success: false,
                    error: 'Email and password are required'
                }, 400);
            }

            const user = await this.userRepository.validatePassword(email, password);

            return c.json({
                success: true,
                data: user,
                message: 'Login successful'
            }, 200);

        } catch (error) {
            console.log(error);
            return c.json({ error: 'Internal server error', message: error }, 500);
        }
    }
}