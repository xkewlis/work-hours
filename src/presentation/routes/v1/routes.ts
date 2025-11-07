import { Hono } from "hono";
import UserRoutes from "./user/routes";
import WorkMarksRoutes from "./workMark/routes";
import WorkDaysRoutes from "./workDays/routes";

export class Routes {
    public get routes(): Hono{
        const routes = new Hono();
        routes.route("/users", new UserRoutes().routes);
        routes.route("/work-days", new WorkDaysRoutes().routes);
        routes.route("/work-marks", new WorkMarksRoutes().routes);
        return routes;
    }
}