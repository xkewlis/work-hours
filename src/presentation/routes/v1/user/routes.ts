import { Hono } from "hono";
import UserController from "./controller";

export default class UserRoutes {
    private readonly controller = new UserController();

    public get routes(): Hono {
        const router = new Hono();
        
        // Auth routes
        router.post('/auth/register', this.controller.register);
        router.post('/auth/login', this.controller.login);
        router.post('/auth/google', this.controller.googleAuth);
        
        return router;
    }
}