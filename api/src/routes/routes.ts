import { Router } from 'express';
import { CategoriaRoutes } from './categoria.routes';
import { CitaRoutes } from './cita.routes';
import { EspecialidadRoutes } from './Especialidad.routes';
import { EstadoCitaRoutes } from './EstadoCita.routes';
import { HistorialEstadoRoutes } from './historialEstado.routes';
import { ModalidadRoutes } from './modalidad.routes';
import { PerfilProfesionalRoutes } from './perfilProfesional.routes';
import { ProfesionalEspecialidadRoutes } from './ProfesionalEspecialidad.routes';
import { ResenaRoutes } from './resena.routes';
import { RolRouts } from './rol.routes';
import { ServicioRoutes } from './Servicio.routes';
import { ServicioEspecialidadRoutes } from './ServicioEspecialidad.routes';
import { UsuarioRoutes } from './usuario.routes';
import { ImageRoutes } from './image.routes';

export class AppRoutes {
    static get routes(): Router {
        const router = Router();
        router.use('/categoria', CategoriaRoutes.routes)
        router.use('/cita', CitaRoutes.routes)   
        router.use('/especialidad', EspecialidadRoutes.routes) 
        router.use('/estadoCita', EstadoCitaRoutes.routes)   
        router.use('/historialEstado', HistorialEstadoRoutes.routes)
        router.use('/images', ImageRoutes.routes);   
        router.use('/modalidad', ModalidadRoutes.routes) 
        router.use('/profesionales', PerfilProfesionalRoutes.routes)  
        router.use('/profesionalEspecialidad', ProfesionalEspecialidadRoutes.routes)       
        router.use('/resena', ResenaRoutes.routes) 
        router.use('/rol', RolRouts.routes)         
        router.use('/servicio', ServicioRoutes.routes)  
        router.use('/servicioEspecialidad', ServicioEspecialidadRoutes.routes)  
        router.use('/usuario', UsuarioRoutes.routes)  

        return router;
    }
}