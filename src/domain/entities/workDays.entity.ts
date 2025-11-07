import { WorkDaySequelize } from "@/infrastructure/database/models";

export class WorkDaysEntity {
    constructor(
        public id: number,
        public userId: number,
        public workDate: string,
        public totalWorkedSeconds: number | null,
        public createdAt?: Date,
        public updatedAt?: Date,
        public deletedAt?: Date | null
    ){}

    static fromRow(row: WorkDaySequelize): WorkDaysEntity {
        return new WorkDaysEntity(
            row.id,
            row.userId,
            row.workDate,
            row.totalWorkedSeconds ?? null,
            row.createdAt,
            row.updatedAt,
            row.deletedAt
        );
    }
}