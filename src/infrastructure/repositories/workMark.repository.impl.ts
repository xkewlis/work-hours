import { WorkMarkDto } from "@/domain/dtos/workMark.dto";
import { WorkMarksEntity } from "@/domain/entities/workMark.entity";
import { WorkMarksRepository } from "@/domain/repositories/workMark.repository";
import { WorkMarksDatasourceImpl } from "@/infrastructure/datasources/workMark.datasource.impl";

export class WorkMarksRepositoryImpl implements WorkMarksRepository {
    constructor(
        private readonly workMarksDatasource: WorkMarksDatasourceImpl = new WorkMarksDatasourceImpl()
    ) {}

    async create(workMark: WorkMarkDto): Promise<WorkMarksEntity> {
        return this.workMarksDatasource.create(workMark);
    }

    async findByWorkDayIdOrderByTimestamp(workDayId: number): Promise<WorkMarksEntity[]> {
        return this.workMarksDatasource.findByWorkDayIdOrderByTimestamp(workDayId);
    }

    async findLastMarkByWorkDayId(workDayId: number): Promise<WorkMarksEntity | null> {
        return this.workMarksDatasource.findLastMarkByWorkDayId(workDayId);
    }

    async countByWorkDayId(workDayId: number): Promise<number> {
        return this.workMarksDatasource.countByWorkDayId(workDayId);
    }

    async findTodayMarksByUserId(userId: number): Promise<WorkMarksEntity[]> {
        return this.workMarksDatasource.findTodayMarksByUserId(userId);
    }

    async update(workMark: WorkMarkDto): Promise<WorkMarksEntity> {
        return this.workMarksDatasource.update(workMark);
    }

    async delete(id: number): Promise<void> {
        return this.workMarksDatasource.delete(id);
    }
}