import { Routes } from '@angular/router';

import { MainLayout } from './layout/main-layout/main-layout';
import { Home } from './pages/home/home';

// Guards
import { authGuard } from './core/guards/auth.guard';
import { roleGuard } from './core/guards/role.guard';

//login
import { Login } from './pages/Usuario/login/login';
import { Register } from './pages/Usuario/register/register';
import { Perfil } from './pages/Usuario/perfil/perfil';
import { EditarPerfil } from './pages/Usuario/editarPerfil/editarPerfil';

// Sin autorización
import { SinAutorizacion } from './pages/auth/sin-autorizacion/sin-autorizacion';

// Servicios
import { ServicioList } from './pages/Servicio/servicio-list/servicio-list';
import { ServicioDetail } from './pages/Servicio/servicio-detail/servicio-detail';
import { ServicioAdminList } from './pages/Servicio/servicio-admin-list/servicio-admin-list';
import { ServicioCreatePage } from './pages/Servicio/servicio-create-page/servicio-create-page';
import { ServicioEditPage } from './pages/Servicio/servicio-edit-page/servicio-edit-page';

// Usuarios
import { UsuarioList } from './pages/Usuario/usuario-list/usuario-list';
import { UsuarioDetail } from './pages/Usuario/usuario-detail/usuario-detail';
import { UsuarioAdminList } from './pages/Usuario/usuario-admin-list/usuario-admin-list';

// Citas
import { CitaList } from './pages/Cita/cita-list/cita-list';
import { CitaDetail } from './pages/Cita/cita-detail/cita-detail';
import { CitaCreatePage } from './pages/Cita/Cita-create-page/Cita-create-page';

// Categorías
import { CategoriaList } from './pages/Categoria/categoria-list/categoria-list';

// Profesionales
import { PerfilProfesionalList } from './pages/PerfilProfesional/perfil-profesional-list/perfil-profesional-list';
import { PerfilProfesionalDetail } from './pages/PerfilProfesional/perfil-profesional-detail/perfil-profesional-detail';
import { PerfilProfesionalAdminList } from './pages/PerfilProfesional/perfil-profesional-admin-list/perfil-profesional-admin-list';
import { PerfilProfesionalCreatePage } from './pages/PerfilProfesional/perfil-profesional-create-page/perfilProfesional-create-page';
import { PerfilProfesionalEditPage } from './pages/PerfilProfesional/perfil-profesional-edit-page/perfilProfesional-edit-page';

// Especialidades
import { EspecialidadList } from './pages/Especialidad copy/especialidad-list/especialidad-list';

export const routes: Routes = [

  {
    path: '',
    component: MainLayout,

    children: [

      // INICIO
      {
        path: '',
        component: Home,
        title: 'Inicio'
      },

      // LOGIN
      {
        path: 'login',
        component: Login,
        title: 'Iniciar sesión'
      },

      // REGISTER
      {
        path: 'register',
        component: Register,
        title: 'Crear una cuenta'
      },

      // PERFIL USUARIO
      {
        path: 'perfil',
        component: Perfil,
        title: 'Mi perfil',

        canActivate: [
          authGuard
        ]
      },

      // EDITAR PERFIL
      {
        path: 'perfil/editar',
        component: EditarPerfil,
        title: 'Editar mi perfil',

        canActivate: [
          authGuard
        ]
      },

      //SIN AUTORIZACIÓN
      {
        path: 'sin-autorizacion',
        component: SinAutorizacion,
        title: 'Sin autorización'
      },

      // SERVICIOS
      {
        path: 'servicios',
        component: ServicioList,
        title: 'Catálogo servicios'
      },

      {
        path: 'servicios/:id',
        component: ServicioDetail,
        title: 'Detalle servicio'
      },

      {
        path: 'admin/servicios',
        component: ServicioAdminList,
        title: 'Mantenimiento servicios',

        canActivate: [
          authGuard,
          roleGuard
        ],

        data: {
          roles: ['ADMIN']
        }
      },

      {
        path: 'admin/servicios/create',
        component: ServicioCreatePage,
        title: 'Registrar servicio',

        canActivate: [
          authGuard,
          roleGuard
        ],

        data: {
          roles: ['ADMIN']
        }
      },

      {
        path: 'admin/servicios/edit/:id',
        component: ServicioEditPage,
        title: 'Editar servicio',

        canActivate: [
          authGuard,
          roleGuard
        ],

        data: {
          roles: ['ADMIN']
        }
      },

      // USUARIOS
      {
        path: 'usuarios',
        component: UsuarioList,
        title: 'Catálogo usuarios',

        canActivate: [
          authGuard,
          roleGuard
        ],

        data: {
          roles: ['ADMIN']
        }
      },

      {
        path: 'usuarios/:id',
        component: UsuarioDetail,
        title: 'Detalle usuario',

        canActivate: [
          authGuard,
          roleGuard
        ],

        data: {
          roles: ['ADMIN']
        }
      },

      {
        path: 'admin/usuarios',
        component: UsuarioAdminList,
        title: 'Gestión usuarios',

        canActivate: [
          authGuard,
          roleGuard
        ],

        data: {
          roles: ['ADMIN']
        }
      },

      // PROFESIONALES
      {
        path: 'profesionales',
        component: PerfilProfesionalList,
        title: 'Catálogo profesionales'
      },

      {
        path: 'profesionales/:id',
        component: PerfilProfesionalDetail,
        title: 'Detalle profesional'
      },

      {
        path: 'admin/profesionales',
        component: PerfilProfesionalAdminList,
        title: 'Gestión profesionales',

        canActivate: [
          authGuard,
          roleGuard
        ],

        data: {
          roles: ['ADMIN']
        }
      },

      {
        path: 'admin/profesionales/create',
        component: PerfilProfesionalCreatePage,
        title: 'Registrar profesional',

        canActivate: [
          authGuard,
          roleGuard
        ],

        data: {
          roles: ['ADMIN']
        }
      },

      {
        path: 'admin/profesionales/edit/:id',
        component: PerfilProfesionalEditPage,
        title: 'Editar profesional',

        canActivate: [
          authGuard,
          roleGuard
        ],

        data: {
          roles: ['ADMIN']
        }
      },

      // CITAS
      {
        path: 'citas',
        component: CitaList,
        title: 'Listado de citas',

        canActivate: [
          authGuard,
          roleGuard
        ],

        data: {
          roles: ['ADMIN']
        }
      },

      {
        path: 'citas/create',
        component: CitaCreatePage,
        title: 'Registrar cita',

        canActivate: [
          authGuard,
          roleGuard
        ],

        data: {
          roles: ['CLIENTE']
        }
      },

      {
        path: 'citas/:id',
        component: CitaDetail,
        title: 'Detalle cita',

        canActivate: [
          authGuard,
          roleGuard
        ],

        data: {
          roles: ['ADMIN']
        }
      },

      // CATEGORÍAS
      {
        path: 'categorias',
        component: CategoriaList,
        title: 'Catálogo categorías',

        canActivate: [
          authGuard,
          roleGuard
        ],

        data: {
          roles: ['ADMIN']
        }
      },

      // ESPECIALIDADES
      {
        path: 'especialidades',
        component: EspecialidadList,
        title: 'Catálogo especialidades',

        canActivate: [
          authGuard,
          roleGuard
        ],

        data: {
          roles: ['ADMIN']
        }
      },

    ],
  },

  {
    path: '**',
    redirectTo: ''
  }

];