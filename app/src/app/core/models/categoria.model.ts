import { Servicio } from './servicio.model';

export interface Categoria {
  id: number;
  nombre: string;
  descripcion?: string | null;
  estado: boolean;
  servicios?: Servicio[];
}

export interface CategoriaCreateDto {
  nombre: string;
  descripcion?: string | null;
  estado?: boolean; // opcional porque en backend tiene default true
}

export interface CategoriaUpdateDto {
  nombre?: string;
  descripcion?: string | null;
  estado?: boolean;
}