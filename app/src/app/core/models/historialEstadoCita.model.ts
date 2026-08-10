import { Cita } from './cita.model';
import { EstadoCita } from './estadoCita.model';

export interface HistorialEstadoCita {
  id: number;
  idCita: number;
  idEstadoAnterior?: number | null;
  idEstadoNuevo: number;
  fechaCambio: string; 
  comentario?: string | null;
  cita: Cita;
  estadoAnterior?: EstadoCita | null;
  estadoNuevo: EstadoCita;
}
