import { Cita } from './cita.model';
import { HistorialEstadoCita } from './historialEstadoCita.model';

export interface EstadoCita {
  id: number;
  nombre: string;
  citas?: Cita[];
  historialAnterior?: HistorialEstadoCita[];
  historialNuevo?: HistorialEstadoCita[];
}
