import { WorkDaysRepositoryImpl } from "@/infrastructure/repositories/workDays.repository.impl";
import { Context } from "hono";

export default class WorkDaysController {
    private readonly workDaysRepository = new WorkDaysRepositoryImpl();

    // Obtener el día de trabajo actual del usuario
    public getTodayWorkDay = async (c: Context) => {
        try {
            const userId = c.req.query('userId');

            if (!userId) {
                return c.json({
                    success: false,
                    error: 'userId is required'
                }, 400);
            }

            const workDay = await this.workDaysRepository.findTodayByUserId(Number(userId));

            return c.json({
                success: true,
                data: workDay,
                message: workDay ? 'Work day found' : 'No work day for today'
            }, 200);

        } catch (error) {
            console.log(error);
            return c.json({ error: 'Internal server error', message: error }, 500);
        }
    }

    // Obtener días trabajados por rango de fechas
    public getWorkDaysByDateRange = async (c: Context) => {
        try {
            const userId = c.req.query('userId');
            const startDate = c.req.query('startDate');
            const endDate = c.req.query('endDate');

            if (!userId || !startDate || !endDate) {
                return c.json({
                    success: false,
                    error: 'userId, startDate and endDate are required'
                }, 400);
            }

            const workDays = await this.workDaysRepository.findByUserIdAndDateRange(
                Number(userId),
                startDate,
                endDate
            );

            return c.json({
                success: true,
                data: workDays,
                message: 'Work days retrieved successfully'
            }, 200);

        } catch (error) {
            console.log(error);
            return c.json({ error: 'Internal server error', message: error }, 500);
        }
    }

    // Obtener total de horas trabajadas en un mes
    public getMonthlyTotal = async (c: Context) => {
        try {
            const userId = c.req.query('userId');
            const year = c.req.query('year');
            const month = c.req.query('month');

            if (!userId || !year || !month) {
                return c.json({
                    success: false,
                    error: 'userId, year and month are required'
                }, 400);
            }

            const totalSeconds = await this.workDaysRepository.getTotalWorkedSecondsByUserAndMonth(
                Number(userId),
                Number(year),
                Number(month)
            );

            return c.json({
                success: true,
                data: {
                    totalSeconds,
                    totalHours: (totalSeconds / 3600).toFixed(2)
                },
                message: 'Monthly total retrieved successfully'
            }, 200);

        } catch (error) {
            console.log(error);
            return c.json({ error: 'Internal server error', message: error }, 500);
        }
    }

    // Obtener total de horas trabajadas en una semana
    public getWeeklyTotal = async (c: Context) => {
        try {
            const userId = c.req.query('userId');
            const startDate = c.req.query('startDate');
            const endDate = c.req.query('endDate');

            if (!userId || !startDate || !endDate) {
                return c.json({
                    success: false,
                    error: 'userId, startDate and endDate are required'
                }, 400);
            }

            const totalSeconds = await this.workDaysRepository.getTotalWorkedSecondsByUserAndWeek(
                Number(userId),
                startDate,
                endDate
            );

            return c.json({
                success: true,
                data: {
                    totalSeconds,
                    totalHours: (totalSeconds / 3600).toFixed(2)
                },
                message: 'Weekly total retrieved successfully'
            }, 200);

        } catch (error) {
            console.log(error);
            return c.json({ error: 'Internal server error', message: error }, 500);
        }
    }
}