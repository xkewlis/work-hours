import sequelize from "@/infrastructure/database/sequelize";
import {Hono} from "hono";
import { Routes } from "./v1/routes";

export default class AppRoutes {
    public get routes(): Hono {
        const routes = new Hono();
        routes.get("/", async (c) => {
            let dbStatus = false;
            let responseTime = null;

            try {
                const start = performance.now();
                await sequelize.query("SELECT NOW()");
                const end = performance.now();
                dbStatus = true;
                responseTime = (end - start) / 1000;
            } catch (error) {
                console.error("DB connection failed:", error);
                dbStatus = false;
            }
            return c.json({
                info: {
                    Title: 'Work hours Service',
                    Version: '1.0.0',
                    Author: 'Kewlis',
                },
                quote: "Hello world",
                db: {
                    status: dbStatus,
                    responseTime
                }
            });
        });
        routes.route("/api/v1", new Routes().routes)
        return routes;
    }
}