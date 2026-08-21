import { Component, inject, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { forkJoin } from 'rxjs';
import { ServicioForm } from '../../../shared/components/servicio-form/servicio-form';
import { ServicioService } from '../../../core/services/servicio.service';
import { PerfilProfesionalService } from '../../../core/services/perfilProfesionalService';
import { CategoriaService } from '../../../core/services/Categoria.Service';
import { ModalidadService } from '../../../core/services/modalidad.service';
import { EspecialidadService } from '../../../core/services/especialidad.service';

import { Servicio, ServicioUpdateDto } from '../../../core/models/servicio.model';
import { PerfilProfesional } from '../../../core/models/perfilProfesional.model';
import { Categoria } from '../../../core/models/categoria.model';
import { Modalidad } from '../../../core/models/modalidad.model';
import { Especialidad } from '../../../core/models/especialidad.model';

@Component({
  selector: 'app-servicio-edit-page',
  standalone: true,
  imports: [ServicioForm],
  templateUrl: './servicio-edit-page.html',
  styleUrl: './servicio-edit-page.css',
})
export class ServicioEditPage {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly servicioService = inject(ServicioService);
  private readonly perfilService = inject(PerfilProfesionalService);
  private readonly categoriaService = inject(CategoriaService);
  private readonly modalidadService = inject(ModalidadService);
  private readonly especialidadService = inject(EspecialidadService);

  servicio = signal<Servicio | null>(null);
  perfiles = signal<PerfilProfesional[]>([]);
  categorias = signal<Categoria[]>([]);
  modalidades = signal<Modalidad[]>([]);
  especialidades = signal<Especialidad[]>([]);
  loading = signal(true);
  saving = signal(false);
  error = signal<string | null>(null);

  private readonly id = Number(this.route.snapshot.paramMap.get('id'));

  constructor() {
    this.cargarDatosFormulario();
  }

  cargarDatosFormulario() {
    if (!this.id) {
      this.error.set('El identificador del servicio no es válido');
      this.loading.set(false);
      return;
    }

    this.loading.set(true);
    this.error.set(null);

    forkJoin({
      servicio: this.servicioService.obtenerPorId(this.id),
      perfiles: this.perfilService.listar(),
      categorias: this.categoriaService.listar(),
      modalidades: this.modalidadService.listar(),
      especialidades: this.especialidadService.listar(),
    }).subscribe({
      next: ({ servicio, perfiles, categorias, modalidades, especialidades }) => {
        console.log('Servicio recibido desde API:', servicio.data);
        this.servicio.set(servicio.data);
        this.perfiles.set(perfiles.data ?? []);
        this.categorias.set(categorias.data ?? []);
        this.modalidades.set(modalidades.data ?? []);
        this.especialidades.set(especialidades.data ?? []);
      },
      error: (err) => {
        console.error('Error al cargar servicio:', err);
        this.error.set('No se pudo cargar la información del servicio');
      },
      complete: () => {
        this.loading.set(false);
      },
    });
  }

  guardar(data: ServicioUpdateDto) {
    if (!this.id) return;
    this.saving.set(true);
    this.error.set(null);

    const dto = data as ServicioUpdateDto;
    console.log('Data enviada al API:', JSON.stringify(dto, null, 2));

    this.servicioService.actualizar(this.id, dto).subscribe({
      next: (updated) => {
        console.log('Servicio actualizado:', updated);
        this.router.navigate(['/admin/servicios']);
      },
      error: (err) => {
        console.error('Error al actualizar servicio:', err);
        this.error.set(err?.error?.message ?? 'No se pudo actualizar el servicio');
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