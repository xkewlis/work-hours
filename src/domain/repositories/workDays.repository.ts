import { WorkDaysEntity } from "@/domain/entities/workDays.entity";

export abstract class WorkDaysRepository {
    // Crear o encontrar el día de trabajo (cuando se hace la primera marcación del día)
    abstract findOrCreate(userId: number, workDate: string): Promise<WorkDaysEntity>;
    
    // Para el dashboard - obtener el día actual con sus horas trabajadas
    abstract findTodayByUserId(userId: number): Promise<WorkDaysEntity | null>;
    
    // Para la vista de historial - ver días trabajados por rango
    abstract findByUserIdAndDateRange(userId: number, startDate: string, endDate: string): Promise<WorkDaysEntity[]>;
    
    // Para actualizar el total cuando se agregan nuevas marcaciones
    abstract updateTotalWorkedSeconds(id: number, totalSeconds: number): Promise<WorkDaysEntity>;
    
    // Para estadísticas en el dashboard
    abstract getTotalWorkedSecondsByUserAndMonth(userId: number, year: number, month: number): Promise<number>;
    abstract getTotalWorkedSecondsByUserAndWeek(userId: number, startDate: string, endDate: string): Promise<number>;
}