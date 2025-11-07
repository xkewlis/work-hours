import { WorkMarkDto } from "@/domain/dtos/workMark.dto";
import { WorkMarksEntity } from "@/domain/entities/workMark.entity";
import { MarkType } from "@/shared/enum";

export abstract class WorkMarksDatasource {
    // Operaciones básicas CRUD
    abstract create(workMark: WorkMarkDto): Promise<WorkMarksEntity>;
    abstract findById(id: number): Promise<WorkMarksEntity | null>;
    abstract update(workMark: WorkMarkDto): Promise<WorkMarksEntity>;
    abstract delete(id: number): Promise<void>;

    // Obtener marcaciones de un día de trabajo
    abstract findByWorkDayId(workDayId: number): Promise<WorkMarksEntity[]>;
    
    // Obtener marcaciones ordenadas cronológicamente
    abstract findByWorkDayIdOrderByTimestamp(workDayId: number): Promise<WorkMarksEntity[]>;

    // Validaciones para lógica de negocio
    abstract countByWorkDayId(workDayId: number): Promise<number>;
    abstract findLastMarkByWorkDayId(workDayId: number): Promise<WorkMarksEntity | null>;
    abstract existsMarkType(workDayId: number, markType: MarkType): Promise<boolean>;

    // Para el dashboard - obtener marcaciones del día actual
    abstract findTodayMarksByUserId(userId: number): Promise<WorkMarksEntity[]>;
}