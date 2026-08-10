import { Usuario } from './usuario.model';
import { Modalidad } from './modalidad.model';
import { Servicio } from './servicio.model';
import { ProfesionalEspecialidad } from './profesionalEspecialidad.model';
import { Cita } from './cita.model';
import { Resena } from './resena.model';

export interface PerfilProfesional {
  id: number;
  idUsuario: number;
  idModalidad?: number | null;
  tituloProfesional: string;
  descripcion?: string | null;
  annosExperiencia?: number | null;
  provincia?: string | null;
  canton?: string | null;
  distrito?: string | null;
  tarifaBase?: number | null;
  disponible: boolean;
  imagenPerfil?: string | null;
  usuario: Usuario;
  modalidad?: Modalidad | null;
  servicios?: Servicio[];
  especialidades?: ProfesionalEspecialidad[];
  citas?: Cita[];
  resenas?: Resena[];
}

export interface PerfilProfesionalFormModel {
  idUsuario: number;

  tituloProfesional: string;
  descripcion: string;
  annosExperiencia: number;
  idModalidad: number | null;
  provincia: string;
  canton: string;
  distrito: string;
  tarifaBase: number;
  disponible: boolean;
  imagenPerfil: string;

  especialidadIds: number[];
}

export interface PerfilProfesionalCreateDto {

  idUsuario: number;

  idModalidad: number;
  tituloProfesional: string;
  descripcion: string;
  annosExperiencia: number;
  provincia: string;
  canton: string;
  distrito: string;
  tarifaBase: number;
  disponible: boolean;
  imagenPerfil: string;

  especialidadIds: number[];
}

export interface PerfilProfesionalUpdateDto {
  idUsuario?: number;

  idModalidad?: number | null;
  tituloProfesional?: string;
  descripcion?: string;
  annosExperiencia?: number;
  provincia?: string;
  canton?: string;
  distrito?: string;
  tarifaBase?: number;
  disponible?: boolean;
  imagenPerfil?: string;

  especialidadIds?: number[];
}