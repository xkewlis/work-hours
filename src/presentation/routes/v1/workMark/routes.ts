import { Hono } from "hono";
import WorkMarksController from "./controller";

export default class WorkMarksRoutes {
    private readonly controller = new WorkMarksController();

    public get routes(): Hono {
        const router = new Hono();
        
        // Work marks routes
        router.post('/', this.controller.createMark);
        router.get('/today', this.controller.getTodayMarks);
        router.get('/work-day/:workDayId', this.controller.getMarksByWorkDayId);
        router.put('/', this.controller.updateMark);
        router.delete('/:id', this.controller.deleteMark);
        
        return router;
    }
}