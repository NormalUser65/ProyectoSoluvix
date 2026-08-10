import { ProfesionalEspecialidad } from './profesionalEspecialidad.model';
import { ServicioEspecialidad } from './servicioEspecialidad.model';

export interface Especialidad {
  id: number;
  nombre: string;
  descripcion?: string | null;
  estado: boolean;
  profesionales?: ProfesionalEspecialidad[];
  servicios?: ServicioEspecialidad[];
}

export interface EspecialidadCreateDto {
  nombre: string;
  descripcion?: string | null;
  estado?: boolean; 
}

export interface EspecialidadUpdateDto {
  nombre?: string;
  descripcion?: string | null;
  estado?: boolean;
}