import { Component, inject, signal } from '@angular/core';

import { Router } from '@angular/router';
import { forkJoin } from 'rxjs';

import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

import { CitaForm } from '../../../shared/components/Cita-form/Cita-form';
import { CitaService } from '../../../core/services/Cita.Service';

import { AuthService } from '../../../core/services/auth.service';
import { PerfilProfesionalService } from '../../../core/services/perfilProfesionalService';
import { ServicioService } from '../../../core/services/servicio.service';
import { ModalidadService } from '../../../core/services/modalidad.service';

import { PerfilProfesional } from '../../../core/models/perfilProfesional.model';
import { Servicio } from '../../../core/models/servicio.model';
import { Modalidad } from '../../../core/models/modalidad.model';

import { CitaCreateDto } from '../../../core/models/cita.model';

@Component({
  selector: 'app-cita-create-page',
  standalone: true,

  imports: [
    CitaForm,
    MatCardModule,
    MatIconModule,
    MatProgressSpinnerModule
  ],

  templateUrl: './Cita-create-page.html',
  styleUrl: './Cita-create-page.css',
})
export class CitaCreatePage {
  private readonly router = inject(Router);

  private readonly citaService = inject(CitaService);

  private readonly authService = inject(AuthService);

  private readonly perfilProfesionalService = inject(PerfilProfesionalService);

  private readonly servicioService = inject(ServicioService);

  private readonly modalidadService = inject(ModalidadService);

  readonly usuario = this.authService.usuario;

  profesionales = signal<PerfilProfesional[]>([]);

  servicios = signal<Servicio[]>([]);

  modalidades = signal<Modalidad[]>([]);

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
      profesionales: this.perfilProfesionalService.listar(),

      servicios: this.servicioService.listar(),

      modalidades: this.modalidadService.listar(),
    }).subscribe({
      next: ({
        profesionales,
        servicios,
        modalidades
      }) => {
        this.profesionales.set(
          (profesionales.data ?? []).filter(
            (profesional) =>
              profesional.disponible === true
          )
        );

        this.servicios.set(
          (servicios.data ?? []).filter(
            (servicio) =>
              servicio.estado === true
          )
        );

        this.modalidades.set(
          modalidades.data ?? []
        );
      },

      error: (err) => {
        console.error(
          'Error al cargar datos de la cita:',
          err
        );

        this.error.set(
          'No se pudieron cargar los datos del formulario'
        );

        this.loading.set(false);
      },

      complete: () => {
        this.loading.set(false);
      },
    });
  }

  guardar(data: CitaCreateDto) {
    this.saving.set(true);

    this.error.set(null);

    console.log(
      'Cita enviada al API:',
      JSON.stringify(data, null, 2)
    );

    this.citaService.crear(data).subscribe({
      next: () => {
        this.router.navigate(['/']);
      },

      error: (err) => {
        console.error(
          'Error al registrar la cita:',
          err
        );

        this.error.set(
          err?.error?.message ??
          'No se pudo registrar la cita'
        );

        this.saving.set(false);
      },

      complete: () => {
        this.saving.set(false);
      },
    });
  }

  cancelar() {
    this.router.navigate(['/']);
  }
}