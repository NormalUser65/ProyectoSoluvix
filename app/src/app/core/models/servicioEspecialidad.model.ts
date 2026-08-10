import { Servicio } from './servicio.model';
import { Especialidad } from './especialidad.model';

export interface ServicioEspecialidad {
  id: number;
  idServicio: number;
  idEspecialidad: number;
  especialidad: Especialidad; 
}

