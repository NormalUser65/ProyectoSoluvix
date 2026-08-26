import { Usuario } from './usuario.model';
import { PerfilProfesional } from './perfilProfesional.model';
import { Servicio } from './servicio.model';
import { Modalidad } from './modalidad.model';
import { EstadoCita } from './estadoCita.model';
import { HistorialEstadoCita } from './historialEstadoCita.model';
import { Resena } from './resena.model';

export interface Cita {
  id: number;
  idCliente: number;
  idProfesional: number;
  idServicio: number;
  idModalidad: number;
  idEstado: number;

  fechaCreacion: string;
  fechaCita: string;
  horaInicio: string;
  horaFin: string;

  comentarioCliente?: string | null;
  comentarioProfesional?: string | null;
  montoEstimado?: number | null;

  cliente: Usuario;
  profesional: PerfilProfesional;
  servicio: Servicio;
  modalidad: Modalidad;
  estado: EstadoCita;

  historial?: HistorialEstadoCita[];
  resena?: Resena | null;
}

export interface CitaCreateDto {
  idProfesional: number;
  idServicio: number;
  idModalidad: number;

  fechaCita: string;
  horaInicio: string;
  horaFin: string;

  comentarioCliente: string;
  montoEstimado?: number | null;
}

export interface CitaUpdateDto {
  idEstado?: number;
  fechaCita?: string;
  horaInicio?: string;
  horaFin?: string;
  comentarioCliente?: string | null;
  comentarioProfesional?: string | null;
  montoEstimado?: number | null;
}

export interface CitaFormModel {
  idCliente: number | null;
  idProfesional: number | null;
  idServicio: number | null;
  idModalidad: number | null;

  fechaCita: string;
  horaInicio: string;
  horaFin: string;

  comentarioCliente: string;
  montoEstimado: number | null;
}