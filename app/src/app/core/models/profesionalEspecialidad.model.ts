import { PerfilProfesional } from './perfilProfesional.model';
import { Especialidad } from './especialidad.model';

export interface ProfesionalEspecialidad {
  id: number;
  idPerfil: number;
  idEspecialidad: number;
  perfil: PerfilProfesional;
  especialidad: Especialidad;
}
