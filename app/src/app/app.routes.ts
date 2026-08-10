import { Routes } from '@angular/router';
import { MainLayout } from './layout/main-layout/main-layout';
import { Home } from './pages/home/home';

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
      { path: '', component: Home, title: 'Inicio' },

      // Servicios
      { path: 'servicios', component: ServicioList, title: 'Catálogo servicios' },
      { path: 'servicios/:id', component: ServicioDetail, title: 'Detalle servicio' },
      { path: 'admin/servicios', component: ServicioAdminList, title: 'Mantenimiento servicios' },
      { path: 'admin/servicios/create', component: ServicioCreatePage, title: 'Registrar servicio' },
      { path: 'admin/servicios/edit/:id', component: ServicioEditPage, title: 'Editar servicio' },

      // Usuarios
      { path: 'usuarios', component: UsuarioList, title: 'Catálogo usuarios' },
      { path: 'usuarios/:id', component: UsuarioDetail, title: 'Detalle usuario' },
      { path: 'admin/usuarios', component: UsuarioAdminList, title: 'Gestión usuarios' },

      // Profesionales
      { path: 'profesionales', component: PerfilProfesionalList, title: 'Catálogo profesionales' },
      { path: 'profesionales/:id', component: PerfilProfesionalDetail, title: 'Detalle profesional' },
      { path: 'admin/profesionales', component: PerfilProfesionalAdminList, title: 'Gestión profesionales' },
      { path: 'admin/profesionales/create', component: PerfilProfesionalCreatePage, title: 'Registrar profesional' },
      { path: 'admin/profesionales/edit/:id', component: PerfilProfesionalEditPage, title: 'Editar profesional' },

      // Citas
      { path: 'citas', component: CitaList, title: 'Listado de citas' },
      { path: 'citas/create', component: CitaCreatePage, title: 'Registrar cita' },
      { path: 'citas/:id', component: CitaDetail, title: 'Detalle cita' },

      // Categorías
      { path: 'categorias', component: CategoriaList, title: 'Catálogo categorías' },

      // Especialidades
      { path: 'especialidades', component: EspecialidadList, title: 'Catálogo especialidades' },
    ],
  },
  { path: '**', redirectTo: '' },
];