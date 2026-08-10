import { Usuario } from './usuario.model';

export interface Rol {
  id: number;
  nombre: string;
  usuarios?: Usuario[];
}