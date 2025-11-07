import { CustomError } from "@/shared/custom.error";
import { WorkDaySequelize } from "@/infrastructure/database/models";
import { Op } from "sequelize";
import { WorkDaysDatasource } from "@/domain/datasources/workDays.datasource";
import { WorkDaysEntity } from "@/domain/entities/workDays.entity";
import { WorkDayDto } from "@/domain/dtos/workDays.dto";

export class WorkDaysDatasourceImpl implements WorkDaysDatasource {
    async create(workDay: WorkDayDto): Promise<WorkDaysEntity> {
        try {
            const newWorkDay = await WorkDaySequelize.create({
                userId: workDay.userId,
                workDate: new Date(`${workDay.workDate}T00:00:00Z`),
                totalWorkedSeconds: workDay.totalWorkedSeconds
            });
            return WorkDaysEntity.fromRow(newWorkDay);
        } catch (error) {
            throw CustomError.internalServer(`Unexpected error in WorkDaysDatasourceImpl.create: ${error}`);
        }
    }

    async findById(id: number): Promise<WorkDaysEntity | null> {
        try {
            const workDayRow = await WorkDaySequelize.findByPk(id);
            if (!workDayRow) {
                return null;
            }
            return WorkDaysEntity.fromRow(workDayRow);
        } catch (error) {
            throw CustomError.internalServer(`Unexpected error in WorkDaysDatasourceImpl.findById: ${error}`);
        }
    }

    async update(workDay: WorkDayDto): Promise<WorkDaysEntity> {
        try {
            if (!workDay.id) {
                throw CustomError.badRequest('Work day id is required for update');
            }

            const workDayRow = await WorkDaySequelize.findByPk(workDay.id);
            if (!workDayRow) {
                throw CustomError.notFound(`Work day with id ${workDay.id} not found`);
            }

            await workDayRow.update({
                userId: workDay.userId,
                workDate: new Date(`${workDay.workDate}T00:00:00Z`),
                totalWorkedSeconds: workDay.totalWorkedSeconds,
                updatedAt: new Date()
            });

            return WorkDaysEntity.fromRow(workDayRow);
        } catch (error) {
            if (error instanceof CustomError) {
                throw error;
            }
            throw CustomError.internalServer(`Unexpected error in WorkDaysDatasourceImpl.update: ${error}`);
        }
    }

    async delete(id: number): Promise<void> {
        try {
            const workDayRow = await WorkDaySequelize.findByPk(id);
            if (!workDayRow) {
                throw CustomError.notFound(`Work day with id ${id} not found`);
            }

            // Soft delete
            await workDayRow.update({
                deletedAt: new Date()
            });
        } catch (error) {
            if (error instanceof CustomError) {
                throw error;
            }
            throw CustomError.internalServer(`Unexpected error in WorkDaysDatasourceImpl.delete: ${error}`);
        }
    }

    async findByUserAndDate(userId: number, workDate: string): Promise<WorkDaysEntity | null> {
        try {
            const workDayRow = await WorkDaySequelize.findOne({
                where: {
                    userId,
                    workDate,
                    deletedAt: null
                }
            });

            if (!workDayRow) {
                return null;
            }

            return WorkDaysEntity.fromRow(workDayRow);
        } catch (error) {
            throw CustomError.internalServer(`Unexpected error in WorkDaysDatasourceImpl.findByUserAndDate: ${error}`);
        }
    }

    async findOrCreate(userId: number, workDate: string): Promise<WorkDaysEntity> {
        try {
            const existingWorkDay = await this.findByUserAndDate(userId, workDate);
            
            if (existingWorkDay) {
                return existingWorkDay;
            }

            const newWorkDay = await WorkDaySequelize.create({
                userId,
                workDate: new Date(`${workDate}T00:00:00Z`),
                totalWorkedSeconds: null
            });

            return WorkDaysEntity.fromRow(newWorkDay);
        } catch (error) {
            if (error instanceof CustomError) {
                throw error;
            }
            throw CustomError.internalServer(`Unexpected error in WorkDaysDatasourceImpl.findOrCreate: ${error}`);
        }
    }

    async findByUserId(userId: number): Promise<WorkDaysEntity[]> {
        try {
            const workDayRows = await WorkDaySequelize.findAll({
                where: {
                    userId,
                    deletedAt: null
                },
                order: [['workDate', 'DESC']]
            });

            return workDayRows.map(row => WorkDaysEntity.fromRow(row));
        } catch (error) {
            throw CustomError.internalServer(`Unexpected error in WorkDaysDatasourceImpl.findByUserId: ${error}`);
        }
    }

    async findByUserIdAndDateRange(userId: number, startDate: string, endDate: string): Promise<WorkDaysEntity[]> {
        try {
            const workDayRows = await WorkDaySequelize.findAll({
                where: {
                    userId,
                    workDate: {
                        [Op.between]: [startDate, endDate]
                    },
                    deletedAt: null
                },
                order: [['workDate', 'DESC']]
            });

            return workDayRows.map(row => WorkDaysEntity.fromRow(row));
        } catch (error) {
            throw CustomError.internalServer(`Unexpected error in WorkDaysDatasourceImpl.findByUserIdAndDateRange: ${error}`);
        }
    }

    async findTodayByUserId(userId: number): Promise<WorkDaysEntity | null> {
        try {
            const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
            return await this.findByUserAndDate(userId, today);
        } catch (error) {
            throw CustomError.internalServer(`Unexpected error in WorkDaysDatasourceImpl.findTodayByUserId: ${error}`);
        }
    }

    async findCurrentWeekByUserId(userId: number): Promise<WorkDaysEntity[]> {
        try {
            const today = new Date();
            const firstDayOfWeek = new Date(today.setDate(today.getDate() - today.getDay()));
            const lastDayOfWeek = new Date(today.setDate(today.getDate() - today.getDay() + 6));

            const startDate = firstDayOfWeek.toISOString().split('T')[0];
            const endDate = lastDayOfWeek.toISOString().split('T')[0];

            return await this.findByUserIdAndDateRange(userId, startDate, endDate);
        } catch (error) {
            throw CustomError.internalServer(`Unexpected error in WorkDaysDatasourceImpl.findCurrentWeekByUserId: ${error}`);
        }
    }

    async findCurrentMonthByUserId(userId: number): Promise<WorkDaysEntity[]> {
        try {
            const today = new Date();
            const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
            const lastDayOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0);

            const startDate = firstDayOfMonth.toISOString().split('T')[0];
            const endDate = lastDayOfMonth.toISOString().split('T')[0];

            return await this.findByUserIdAndDateRange(userId, startDate, endDate);
        } catch (error) {
            throw CustomError.internalServer(`Unexpected error in WorkDaysDatasourceImpl.findCurrentMonthByUserId: ${error}`);
        }
    }

    async updateTotalWorkedSeconds(id: number, totalSeconds: number): Promise<WorkDaysEntity> {
        try {
            const workDayRow = await WorkDaySequelize.findByPk(id);
            if (!workDayRow) {
                throw CustomError.notFound(`Work day with id ${id} not found`);
            }

            await workDayRow.update({
                totalWorkedSeconds: totalSeconds,
                updatedAt: new Date()
            });

            return WorkDaysEntity.fromRow(workDayRow);
        } catch (error) {
            if (error instanceof CustomError) {
                throw error;
            }
            throw CustomError.internalServer(`Unexpected error in WorkDaysDatasourceImpl.updateTotalWorkedSeconds: ${error}`);
        }
    }

    async getTotalWorkedSecondsByUserAndMonth(userId: number, year: number, month: number): Promise<number> {
        try {
            const firstDay = new Date(year, month - 1, 1);
            const lastDay = new Date(year, month, 0);

            const startDate = firstDay.toISOString().split('T')[0];
            const endDate = lastDay.toISOString().split('T')[0];

            const workDays = await this.findByUserIdAndDateRange(userId, startDate, endDate);

            return workDays.reduce((total, workDay) => {
                return total + (workDay.totalWorkedSeconds || 0);
            }, 0);
        } catch (error) {
            throw CustomError.internalServer(`Unexpected error in WorkDaysDatasourceImpl.getTotalWorkedSecondsByUserAndMonth: ${error}`);
        }
    }

    async getTotalWorkedSecondsByUserAndWeek(userId: number, startDate: string, endDate: string): Promise<number> {
        try {
            const workDays = await this.findByUserIdAndDateRange(userId, startDate, endDate);

            return workDays.reduce((total, workDay) => {
                return total + (workDay.totalWorkedSeconds || 0);
            }, 0);
        } catch (error) {
            throw CustomError.internalServer(`Unexpected error in WorkDaysDatasourceImpl.getTotalWorkedSecondsByUserAndWeek: ${error}`);
        }
    }
}