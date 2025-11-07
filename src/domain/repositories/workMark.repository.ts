import { WorkMarkDto } from "@/domain/dtos/workMark.dto";
import { WorkMarksEntity } from "../entities/workMark.entity";

export abstract class WorkMarksRepository {
    // Crear una nueva marcación (ENTRY, LUNCH_START, LUNCH_END, EXIT)
    abstract create(workMark: WorkMarkDto): Promise<WorkMarksEntity>;
    
    // Obtener todas las marcaciones de un día específico (para mostrar en el dashboard del día)
    abstract findByWorkDayIdOrderByTimestamp(workDayId: number): Promise<WorkMarksEntity[]>;
    
    // Para validar qué tipo de marcación debe seguir
    abstract findLastMarkByWorkDayId(workDayId: number): Promise<WorkMarksEntity | null>;
    
    // Contar cuántas marcaciones tiene el día (para validar el límite de 4)
    abstract countByWorkDayId(workDayId: number): Promise<number>;
    
    // Obtener marcaciones del día actual del usuario (para el dashboard principal)
    abstract findTodayMarksByUserId(userId: number): Promise<WorkMarksEntity[]>;
    
    // Editar una marcación si se equivocó (opcional pero útil)
    abstract update(workMark: WorkMarkDto): Promise<WorkMarksEntity>;
    
    // Eliminar una marcación (soft delete)
    abstract delete(id: number): Promise<void>;
}