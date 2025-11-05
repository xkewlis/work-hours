import { Hono } from "hono";
import UserRoutes from "./user/routes";

export class Routes {
    public get routes(): Hono{
        const routes = new Hono();
        routes.route("/users", new UserRoutes().routes);
        return routes;
    }
}