import { PerfilProfesional } from './perfilProfesional.model';
import { Servicio } from './servicio.model';
import { Cita } from './cita.model';

export interface Modalidad {
  id: number;
  nombre: string;
  perfiles?: PerfilProfesional[];
  servicios?: Servicio[];
  citas?: Cita[];
}