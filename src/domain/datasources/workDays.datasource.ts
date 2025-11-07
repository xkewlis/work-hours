import { WorkDayDto } from "@/domain/dtos/workDays.dto";
import { WorkDaysEntity } from "@/domain/entities/workDays.entity";

export abstract class WorkDaysDatasource {
    // Operaciones básicas CRUD
    abstract create(workDay: WorkDayDto): Promise<WorkDaysEntity>;
    abstract findById(id: number): Promise<WorkDaysEntity | null>;
    abstract update(workDay: WorkDayDto): Promise<WorkDaysEntity>;
    abstract delete(id: number): Promise<void>;

    // Buscar día de trabajo específico de un usuario
    abstract findByUserAndDate(userId: number, workDate: string): Promise<WorkDaysEntity | null>;
    
    // Crear o encontrar día de trabajo (para cuando se hace la primera marcación del día)
    abstract findOrCreate(userId: number, workDate: string): Promise<WorkDaysEntity>;

    // Obtener días trabajados por usuario con filtros de fecha
    abstract findByUserId(userId: number): Promise<WorkDaysEntity[]>;
    abstract findByUserIdAndDateRange(userId: number, startDate: string, endDate: string): Promise<WorkDaysEntity[]>;

    // Métodos específicos para el dashboard
    abstract findTodayByUserId(userId: number): Promise<WorkDaysEntity | null>;
    abstract findCurrentWeekByUserId(userId: number): Promise<WorkDaysEntity[]>;
    abstract findCurrentMonthByUserId(userId: number): Promise<WorkDaysEntity[]>;

    // Actualizar total de segundos trabajados
    abstract updateTotalWorkedSeconds(id: number, totalSeconds: number): Promise<WorkDaysEntity>;

    // Estadísticas
    abstract getTotalWorkedSecondsByUserAndMonth(userId: number, year: number, month: number): Promise<number>;
    abstract getTotalWorkedSecondsByUserAndWeek(userId: number, startDate: string, endDate: string): Promise<number>;
}