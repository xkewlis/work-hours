import { WorkMarkSequelize } from "@/infrastructure/database/models";

export class WorkMarksEntity {
    constructor(
        public id: number,
        public workDayId: number,
        public type: string,
        public markTimestamp: string,
        public createdAt?: Date,
        public updatedAt?: Date,
        public deletedAt?: Date | null
    ) {}

    static fromRow(row: WorkMarkSequelize): WorkMarksEntity {
        return new WorkMarksEntity(
            row.id,
            row.workDayId,
            row.type,
            row.markTimestamp,
            row.createdAt,
            row.updatedAt,
            row.deletedAt
        );
    }
}