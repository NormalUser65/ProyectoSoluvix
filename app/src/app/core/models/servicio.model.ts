import { PerfilProfesional } from './perfilProfesional.model';
import { Categoria } from './categoria.model';
import { Modalidad } from './modalidad.model';
import { ServicioEspecialidad } from './servicioEspecialidad.model';
import { Cita } from './cita.model';

export interface Servicio {
  id: number;
  idPerfil: number;
  idCategoria: number;
  idModalidad: number;
  nombre: string;
  descripcion?: string | null;
  precio: number;
  duracionEstimada: number;
  estado: boolean;
  fechaCreacion: string; // DateTime → string ISO
  perfil: PerfilProfesional;
  categoria: Categoria;
  modalidad: Modalidad;
  especialidades: ServicioEspecialidad[];
  citas?: Cita[];
}

export interface ServicioFormModel {
  idPerfil: number;
  idCategoria: number;
  idModalidad: number;
  nombre: string;
  descripcion: string;
  precio: number;
  duracionEstimada: number;
  estado: boolean;
  especialidadIds: number[];
}

export interface ServicioCreateDto {
  idPerfil: number;
  idCategoria: number;
  idModalidad: number;
  nombre: string;
  descripcion?: string | null;
  precio: number;
  duracionEstimada: number;
  estado?: boolean;
  especialidadIds?: number[];
}

export interface ServicioUpdateDto {
  idCategoria?: number;
  idModalidad?: number;
  nombre?: string;
  descripcion?: string | null;
  precio?: number;
  duracionEstimada?: number;
  estado?: boolean;
  especialidadIds?: number[];
}
