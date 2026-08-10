import { Component, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { forkJoin } from 'rxjs';
import { ServicioForm } from '../../../shared/components/servicio-form/servicio-form';
import { ServicioService } from '../../../core/services/servicio.service';
import { PerfilProfesionalService } from '../../../core/services/perfilProfesionalService';
import { CategoriaService } from '../../../core/services/Categoria.Service';
import { ModalidadService } from '../../../core/services/modalidad.service';
import { EspecialidadService } from '../../../core/services/especialidad.service';

import { PerfilProfesional } from '../../../core/models/perfilProfesional.model';
import { Categoria } from '../../../core/models/categoria.model';
import { Modalidad } from '../../../core/models/modalidad.model';
import { Especialidad } from '../../../core/models/especialidad.model';
import { ServicioCreateDto, ServicioUpdateDto } from '../../../core/models/servicio.model';

import { TranslocoModule } from '@jsverse/transloco';

@Component({
  selector: 'app-servicio-create-page',
  standalone: true,
  imports: [ServicioForm, TranslocoModule],
  templateUrl: './servicio-create-page.html',
  styleUrl: './servicio-create-page.css',
})
export class ServicioCreatePage {
  private readonly router = inject(Router);
  private readonly servicioService = inject(ServicioService);
  private readonly perfilService = inject(PerfilProfesionalService);
  private readonly categoriaService = inject(CategoriaService);
  private readonly modalidadService = inject(ModalidadService);
  private readonly especialidadService = inject(EspecialidadService);

  perfiles = signal<PerfilProfesional[]>([]);
  categorias = signal<Categoria[]>([]);
  modalidades = signal<Modalidad[]>([]);
  especialidades = signal<Especialidad[]>([]);
  loading = signal(true);
  saving = signal(false);
  error = signal<string | null>(null);

  constructor() {
    this.cargarDatosFormulario();
  }

  cargarDatosFormulario() {
    this.loading.set(true);
    this.error.set(null);

    forkJoin({
      perfiles: this.perfilService.listar(),
      categorias: this.categoriaService.listar(),
      modalidades: this.modalidadService.listar(),
      especialidades: this.especialidadService.listar(),
    }).subscribe({
      next: ({ perfiles, categorias, modalidades, especialidades }) => {
        this.perfiles.set(perfiles.data ?? []);
        this.categorias.set(categorias.data ?? []);
        this.modalidades.set(modalidades.data ?? []);
        this.especialidades.set(especialidades.data ?? []);
      },
      error: (err) => {
        console.error('Error al cargar datos del formulario:', err);
        this.error.set('No se pudieron cargar los datos del formulario');
      },
      complete: () => {
        this.loading.set(false);
      },
    });
  }

  guardar(data: ServicioCreateDto | ServicioUpdateDto) {
    this.saving.set(true);
    this.error.set(null);

    const dto = data as ServicioCreateDto;

    console.log('Data enviada al API:', JSON.stringify(dto, null, 2));

    this.servicioService.crear(dto).subscribe({
      next: () => {
        this.router.navigate(['/admin/servicios']);
      },
      error: (err) => {
        console.error('Error al registrar servicio:', err);
        this.error.set(err?.error?.message ?? 'No se pudo registrar el servicio');
      },
      complete: () => {
        this.saving.set(false);
      },
    });
  }

  cancelar() {
    this.router.navigate(['/admin/servicios']);
  }
}
