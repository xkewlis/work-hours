import { CustomError } from "@/shared/custom.error";
import { WorkMarkSequelize, WorkDaySequelize } from "@/infrastructure/database/models";
import { WorkMarksDatasource } from "@/domain/datasources/workMark.datasouce";
import { WorkMarkDto } from "@/domain/dtos/workMark.dto";
import { WorkMarksEntity } from "@/domain/entities/workMark.entity";
import { MarkType } from "@/shared/enum";

export class WorkMarksDatasourceImpl implements WorkMarksDatasource {
    async create(workMark: WorkMarkDto): Promise<WorkMarksEntity> {
        try {
            const newWorkMark = await WorkMarkSequelize.create({
                workDayId: workMark.workDayId,
                type: workMark.type as MarkType,
                markTimestamp: new Date(workMark.markTimestamp)
            });
            return WorkMarksEntity.fromRow(newWorkMark);
        } catch (error) {
            throw CustomError.internalServer(`Unexpected error in WorkMarksDatasourceImpl.create: ${error}`);
        }
    }

    async findById(id: number): Promise<WorkMarksEntity | null> {
        try {
            const workMarkRow = await WorkMarkSequelize.findByPk(id);
            if (!workMarkRow) {
                return null;
            }
            return WorkMarksEntity.fromRow(workMarkRow);
        } catch (error) {
            throw CustomError.internalServer(`Unexpected error in WorkMarksDatasourceImpl.findById: ${error}`);
        }
    }

    async update(workMark: WorkMarkDto): Promise<WorkMarksEntity> {
        try {
            if (!workMark.id) {
                throw CustomError.badRequest('Work mark id is required for update');
            }

            const workMarkRow = await WorkMarkSequelize.findByPk(workMark.id);
            if (!workMarkRow) {
                throw CustomError.notFound(`Work mark with id ${workMark.id} not found`);
            }

            await workMarkRow.update({
                workDayId: workMark.workDayId,
                type: workMark.type as MarkType,
                markTimestamp: new Date(workMark.markTimestamp),
                updatedAt: new Date()
            });

            return WorkMarksEntity.fromRow(workMarkRow);
        } catch (error) {
            if (error instanceof CustomError) {
                throw error;
            }
            throw CustomError.internalServer(`Unexpected error in WorkMarksDatasourceImpl.update: ${error}`);
        }
    }

    async delete(id: number): Promise<void> {
        try {
            const workMarkRow = await WorkMarkSequelize.findByPk(id);
            if (!workMarkRow) {
                throw CustomError.notFound(`Work mark with id ${id} not found`);
            }

            // Soft delete
            await workMarkRow.update({
                deletedAt: new Date()
            });
        } catch (error) {
            if (error instanceof CustomError) {
                throw error;
            }
            throw CustomError.internalServer(`Unexpected error in WorkMarksDatasourceImpl.delete: ${error}`);
        }
    }

    async findByWorkDayId(workDayId: number): Promise<WorkMarksEntity[]> {
        try {
            const workMarkRows = await WorkMarkSequelize.findAll({
                where: {
                    workDayId,
                    deletedAt: null
                }
            });

            return workMarkRows.map(row => WorkMarksEntity.fromRow(row));
        } catch (error) {
            throw CustomError.internalServer(`Unexpected error in WorkMarksDatasourceImpl.findByWorkDayId: ${error}`);
        }
    }

    async findByWorkDayIdOrderByTimestamp(workDayId: number): Promise<WorkMarksEntity[]> {
        try {
            const workMarkRows = await WorkMarkSequelize.findAll({
                where: {
                    workDayId,
                    deletedAt: null
                },
                order: [['markTimestamp', 'ASC']]
            });

            return workMarkRows.map(row => WorkMarksEntity.fromRow(row));
        } catch (error) {
            throw CustomError.internalServer(`Unexpected error in WorkMarksDatasourceImpl.findByWorkDayIdOrderByTimestamp: ${error}`);
        }
    }

    async countByWorkDayId(workDayId: number): Promise<number> {
        try {
            return await WorkMarkSequelize.count({
                where: {
                    workDayId,
                    deletedAt: null
                }
            });
        } catch (error) {
            throw CustomError.internalServer(`Unexpected error in WorkMarksDatasourceImpl.countByWorkDayId: ${error}`);
        }
    }

    async findLastMarkByWorkDayId(workDayId: number): Promise<WorkMarksEntity | null> {
        try {
            const workMarkRow = await WorkMarkSequelize.findOne({
                where: {
                    workDayId,
                    deletedAt: null
                },
                order: [['markTimestamp', 'DESC']]
            });

            if (!workMarkRow) {
                return null;
            }

            return WorkMarksEntity.fromRow(workMarkRow);
        } catch (error) {
            throw CustomError.internalServer(`Unexpected error in WorkMarksDatasourceImpl.findLastMarkByWorkDayId: ${error}`);
        }
    }

    async existsMarkType(workDayId: number, markType: string): Promise<boolean> {
        try {
            const count = await WorkMarkSequelize.count({
                where: {
                    workDayId,
                    type: markType,
                    deletedAt: null
                }
            });

            return count > 0;
        } catch (error) {
            throw CustomError.internalServer(`Unexpected error in WorkMarksDatasourceImpl.existsMarkType: ${error}`);
        }
    }

    async findTodayMarksByUserId(userId: number): Promise<WorkMarksEntity[]> {
        try {
            const today = new Date().toISOString().split('T')[0];

            const workMarkRows = await WorkMarkSequelize.findAll({
                include: [{
                    model: WorkDaySequelize,
                    as: 'workDay',
                    where: {
                        userId,
                        workDate: today,
                        deletedAt: null
                    },
                    required: true
                }],
                where: {
                    deletedAt: null
                },
                order: [['markTimestamp', 'ASC']]
            });

            return workMarkRows.map(row => WorkMarksEntity.fromRow(row));
        } catch (error) {
            throw CustomError.internalServer(`Unexpected error in WorkMarksDatasourceImpl.findTodayMarksByUserId: ${error}`);
        }
    }
}