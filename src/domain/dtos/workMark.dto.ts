export class WorkMarkDto {
    constructor(
        public workDayId: number,
        public type: string,
        public markTimestamp: string,
        public id?: number,
        public createdAt?: Date,
        public updatedAt?: Date,
        public deletedAt?: Date | null
    ) {}

    static create(object: { [key: string]: any }): [string?, WorkMarkDto?] {
        const { id, workDayId, type, markTimestamp, createdAt, updatedAt, deletedAt } = object;
        const errors: string[] = [];

        if (!workDayId) errors.push('workDayId is required');
        if (!type) errors.push('type is required');
        if (!markTimestamp) errors.push('markTimestamp is required');

        const validTypes = ['ENTRY', 'LUNCH_START', 'LUNCH_END', 'EXIT'];
        if (type && !validTypes.includes(type)) {
            errors.push('type must be one of: ENTRY, LUNCH_START, LUNCH_END, EXIT');
        }

        if (errors.length > 0) {
            return [errors.join(', '), undefined];
        }

        return [
            undefined,
            new WorkMarkDto(
                workDayId,
                type,
                markTimestamp,
                id,
                createdAt,
                updatedAt,
                deletedAt
            )
        ];
    }
}