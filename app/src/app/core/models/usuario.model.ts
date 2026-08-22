import { Rol } from './rol.model';
import { PerfilProfesional } from './perfilProfesional.model';
import { Cita } from './cita.model';
import { Resena } from './resena.model';

export interface Usuario {
  id: number;
  nombre: string;
  apellidos: string;
  correo: string;
  contrasenna: string;
  telefono?: string | null;
  estado: boolean;
  fechaRegistro: string; 
  rol: Rol; // relación completa
  perfilProfesional?: PerfilProfesional | null;
  citasCliente?: Cita[];
  resenas?: Resena[];
}

export interface UsuarioCreateDto {
  nombre: string;
  apellidos: string;
  correo: string;
  contrasenna: string;
  telefono?: string | null;
  idRol: number; 
}

export interface UsuarioUpdateDto {
  nombre?: string;
  apellidos?: string;
  correo?: string;
  contrasenna?: string;
  telefono?: string | null;
  estado?: boolean;
  idRol?: number;
}

export interface LoginRequest {
  correo: string;
  contrasenna: string;
}

export interface LoginResult {
  token: string;
}

export interface RegisterRequest {
  nombre: string;
  apellidos: string;
  correo: string;
  contrasenna: string;
  telefono: string;
  idRol: number;
}