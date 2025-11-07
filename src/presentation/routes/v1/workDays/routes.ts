import { Hono } from "hono";
import WorkDaysController from "./controller";

export default class WorkDaysRoutes {
    private readonly controller = new WorkDaysController();

    public get routes(): Hono {
        const router = new Hono();

        // Work days routes
        router.get('/today', this.controller.getTodayWorkDay);
        router.get('/range', this.controller.getWorkDaysByDateRange);
        router.get('/stats/monthly', this.controller.getMonthlyTotal);
        router.get('/stats/weekly', this.controller.getWeeklyTotal);

        return router;
    }
}