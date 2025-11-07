export class WorkDayDto {
    constructor(
        public userId: number,
        public workDate: string,
        public totalWorkedSeconds: number | null,
        public id?: number,
        public createdAt?: Date,
        public updatedAt?: Date,
        public deletedAt?: Date | null
    ) {}

    static create(object: { [key: string]: any }): [string?, WorkDayDto?] {
        const { id, userId, workDate, totalWorkedSeconds, createdAt, updatedAt, deletedAt } = object;
        const errors: string[] = [];

        if (!id) errors.push('id is required');
        if (!userId) errors.push('userId is required');
        if (!workDate) errors.push('workDate is required');
        if (workDate && typeof workDate !== 'string') errors.push('workDate must be a string');
        if (errors.length > 0) return [errors.join(", "), undefined];
        return [undefined, new WorkDayDto(
            userId,
            workDate,
            totalWorkedSeconds ?? null,
            id,
            createdAt,
            updatedAt,
            deletedAt
        )];
    }
}