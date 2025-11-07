import { WorkDaysEntity } from "@/domain/entities/workDays.entity";
import { WorkDaysRepository } from "@/domain/repositories/workDays.repository";
import { WorkDaysDatasourceImpl } from "@/infrastructure/datasources/workDays.datasource.impl";

export class WorkDaysRepositoryImpl implements WorkDaysRepository {
    constructor(
        private readonly workDaysDatasource: WorkDaysDatasourceImpl = new WorkDaysDatasourceImpl()
    ) {}

    async findOrCreate(userId: number, workDate: string): Promise<WorkDaysEntity> {
        return this.workDaysDatasource.findOrCreate(userId, workDate);
    }

    async findTodayByUserId(userId: number): Promise<WorkDaysEntity | null> {
        return this.workDaysDatasource.findTodayByUserId(userId);
    }

    async findByUserIdAndDateRange(userId: number, startDate: string, endDate: string): Promise<WorkDaysEntity[]> {
        return this.workDaysDatasource.findByUserIdAndDateRange(userId, startDate, endDate);
    }

    async updateTotalWorkedSeconds(id: number, totalSeconds: number): Promise<WorkDaysEntity> {
        return this.workDaysDatasource.updateTotalWorkedSeconds(id, totalSeconds);
    }

    async getTotalWorkedSecondsByUserAndMonth(userId: number, year: number, month: number): Promise<number> {
        return this.workDaysDatasource.getTotalWorkedSecondsByUserAndMonth(userId, year, month);
    }

    async getTotalWorkedSecondsByUserAndWeek(userId: number, startDate: string, endDate: string): Promise<number> {
        return this.workDaysDatasource.getTotalWorkedSecondsByUserAndWeek(userId, startDate, endDate);
    }
}