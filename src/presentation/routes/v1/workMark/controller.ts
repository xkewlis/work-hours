import { WorkMarkDto } from "@/domain/dtos/workMark.dto";
import { WorkDaysRepositoryImpl } from "@/infrastructure/repositories/workDays.repository.impl";
import { WorkMarksRepositoryImpl } from "@/infrastructure/repositories/workMark.repository.impl";
import { Context } from "hono";

export default class WorkMarksController {
    private readonly workMarksRepository = new WorkMarksRepositoryImpl();
    private readonly workDaysRepository = new WorkDaysRepositoryImpl();

    // Crear una nueva marcación
    public createMark = async (c: Context) => {
        try {
            const body = await c.req.json();
            const { userId, type, markTimestamp } = body; // ← Cambiar a userId

            if (!userId) {
                return c.json({
                    success: false,
                    error: 'userId is required'
                }, 400);
            }

            if (!type) {
                return c.json({
                    success: false,
                    error: 'type is required'
                }, 400);
            }

            // ✅ CREAR O ENCONTRAR EL WORKDAY AUTOMÁTICAMENTE
            const today = new Date().toISOString().split('T')[0];
            const workDay = await this.workDaysRepository.findOrCreate(Number(userId), today);

            // Validar máximo 4 marcaciones
            const markCount = await this.workMarksRepository.countByWorkDayId(workDay.id);
            if (markCount >= 4) {
                return c.json({
                    success: false,
                    error: 'Maximum 4 marks per day reached'
                }, 400);
            }

            // Validar secuencia correcta
            const lastMark = await this.workMarksRepository.findLastMarkByWorkDayId(workDay.id);
            const validSequence = ['ENTRY', 'LUNCH_START', 'LUNCH_END', 'EXIT'];

            if (lastMark) {
                const lastIndex = validSequence.indexOf(lastMark.type);
                const currentIndex = validSequence.indexOf(type);

                if (currentIndex !== lastIndex + 1) {
                    return c.json({
                        success: false,
                        error: `Invalid mark sequence. Expected ${validSequence[lastIndex + 1]}, got ${type}`
                    }, 400);
                }
            } else if (type !== 'ENTRY') {
                return c.json({
                    success: false,
                    error: 'First mark must be ENTRY'
                }, 400);
            }

            // Crear el DTO
            const [dtoError, dto] = WorkMarkDto.create({
                workDayId: workDay.id,
                type,
                markTimestamp: markTimestamp || new Date().toISOString()
            });

            if (dtoError || !dto) {
                return c.json({
                    success: false,
                    error: 'Invalid work mark data',
                    details: dtoError
                }, 400);
            }

            const workMark = await this.workMarksRepository.create(dto);

            // Recalcular total si es EXIT
            if (type === 'EXIT') {
                await this.recalculateWorkDayTotal(workDay.id);
            }

            return c.json({
                success: true,
                data: workMark,
                message: 'Work mark created successfully'
            }, 201);

        } catch (error) {
            console.log(error);
            return c.json({ error: 'Internal server error', message: error }, 500);
        }
    }

    // Obtener marcaciones del día actual del usuario
    public getTodayMarks = async (c: Context) => {
        try {
            const userId = c.req.query('userId');

            if (!userId) {
                return c.json({
                    success: false,
                    error: 'userId is required'
                }, 400);
            }

            const marks = await this.workMarksRepository.findTodayMarksByUserId(Number(userId));

            return c.json({
                success: true,
                data: marks,
                message: 'Today marks retrieved successfully'
            }, 200);

        } catch (error) {
            console.log(error);
            return c.json({ error: 'Internal server error', message: error }, 500);
        }
    }

    // Obtener marcaciones de un día de trabajo específico
    public getMarksByWorkDayId = async (c: Context) => {
        try {
            const workDayId = c.req.param('workDayId');

            if (!workDayId) {
                return c.json({
                    success: false,
                    error: 'workDayId is required'
                }, 400);
            }

            const marks = await this.workMarksRepository.findByWorkDayIdOrderByTimestamp(Number(workDayId));

            return c.json({
                success: true,
                data: marks,
                message: 'Work marks retrieved successfully'
            }, 200);

        } catch (error) {
            console.log(error);
            return c.json({ error: 'Internal server error', message: error }, 500);
        }
    }

    // Actualizar una marcación
    public updateMark = async (c: Context) => {
        try {
            const body = await c.req.json();

            const [error, dto] = WorkMarkDto.create(body);
            if (error) {
                return c.json({
                    success: false,
                    error: 'Invalid work mark data',
                    details: error
                }, 400);
            }

            if (!dto || !dto.id) {
                return c.json({
                    success: false,
                    error: 'Work mark id is required for update'
                }, 400);
            }

            const workMark = await this.workMarksRepository.update(dto);

            // Recalcular total si se modificó alguna marca
            await this.recalculateWorkDayTotal(dto.workDayId);

            return c.json({
                success: true,
                data: workMark,
                message: 'Work mark updated successfully'
            }, 200);

        } catch (error) {
            console.log(error);
            return c.json({ error: 'Internal server error', message: error }, 500);
        }
    }

    // Eliminar una marcación
    public deleteMark = async (c: Context) => {
        try {
            const id = c.req.param('id');

            if (!id) {
                return c.json({
                    success: false,
                    error: 'id is required'
                }, 400);
            }

            // Obtener la marca antes de eliminarla para recalcular después
            const mark = await this.workMarksRepository.findLastMarkByWorkDayId(Number(id));

            await this.workMarksRepository.delete(Number(id));

            // Recalcular total
            if (mark) {
                await this.recalculateWorkDayTotal(mark.workDayId);
            }

            return c.json({
                success: true,
                message: 'Work mark deleted successfully'
            }, 200);

        } catch (error) {
            console.log(error);
            return c.json({ error: 'Internal server error', message: error }, 500);
        }
    }

    // Método auxiliar para recalcular total trabajado
    private async recalculateWorkDayTotal(workDayId: number): Promise<void> {
        const marks = await this.workMarksRepository.findByWorkDayIdOrderByTimestamp(workDayId);

        let totalSeconds = 0;
        let entryTime: Date | null = null;
        let lunchStartTime: Date | null = null;

        for (const mark of marks) {
            const timestamp = new Date(mark.markTimestamp);

            switch (mark.type) {
                case 'ENTRY':
                    entryTime = timestamp;
                    break;
                case 'LUNCH_START':
                    if (entryTime) {
                        totalSeconds += (timestamp.getTime() - entryTime.getTime()) / 1000;
                    }
                    lunchStartTime = timestamp;
                    break;
                case 'LUNCH_END':
                    entryTime = timestamp; // Reiniciar desde el fin del lunch
                    break;
                case 'EXIT':
                    if (entryTime) {
                        totalSeconds += (timestamp.getTime() - entryTime.getTime()) / 1000;
                    }
                    break;
            }
        }

        await this.workDaysRepository.updateTotalWorkedSeconds(workDayId, Math.floor(totalSeconds));
    }
}