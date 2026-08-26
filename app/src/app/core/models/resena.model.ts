import { Cita } from './cita.model';
import { Usuario } from './usuario.model';
import { PerfilProfesional } from './perfilProfesional.model';

export interface Resena {
  id: number;
  idCita: number;
  idCliente: number;
  idProfesional: number;
  puntuacion: number;
  comentario?: string | null;
  fechaResenna: string;
  cita: Cita;
  cliente: Usuario;
  profesional: PerfilProfesional;
}

export interface CreateResenaDto {
  idCita: number;
  idCliente: number;
  puntuacion: number;
  comentario?: string | null;
}

export interface ResenaFormModel {
  idCita: number;
  idCliente: number;
  puntuacion: number;
  comentario: string;
}