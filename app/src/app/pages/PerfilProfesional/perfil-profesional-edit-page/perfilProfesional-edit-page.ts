import { Component, inject, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { forkJoin } from 'rxjs';
import { TranslocoModule, TranslocoService } from '@jsverse/transloco';
import { PerfilProfesionalForm } from '../../../shared/components/perfilProfesional-form/perfilProfesional-form';
import { PerfilProfesionalService } from '../../../core/services/perfilProfesionalService';
import { ModalidadService } from '../../../core/services/modalidad.service';
import { EspecialidadService } from '../../../core/services/especialidad.service';
import { PerfilProfesional, PerfilProfesionalUpdateDto } from '../../../core/models/perfilProfesional.model';
import { Modalidad } from '../../../core/models/modalidad.model';
import { Especialidad } from '../../../core/models/especialidad.model';

@Component({
  selector: 'app-perfil-profesional-edit-page',
  standalone: true,
  imports: [PerfilProfesionalForm, TranslocoModule],
  templateUrl: './perfilProfesional-edit-page.html',
  styleUrls: ['./perfilProfesional-edit-page.css'],
})
export class PerfilProfesionalEditPage {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly perfilService = inject(PerfilProfesionalService);
  private readonly modalidadService = inject(ModalidadService);
  private readonly especialidadService = inject(EspecialidadService);
  private readonly translocoService = inject(TranslocoService);

  perfil = signal<PerfilProfesional | null>(null);
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
      this.error.set(this.translocoService.translate('id_invalido'));
      this.loading.set(false);
      return;
    }

    this.loading.set(true);
    this.error.set(null);

    forkJoin({
      perfil: this.perfilService.obtenerPorId(this.id),
      modalidades: this.modalidadService.listar(),
      especialidades: this.especialidadService.listar(),
    }).subscribe({
      next: ({ perfil, modalidades, especialidades }) => {
        console.log('Perfil recibido desde API:', perfil.data); 
        this.perfil.set(perfil.data);
        this.modalidades.set(modalidades.data ?? []);
        this.especialidades.set(especialidades.data ?? []);
      },
      error: (err) => {
        console.error('Error al cargar perfil:', err);
        this.error.set(this.translocoService.translate('error_carga_perfil_detalle'));
      },
      complete: () => {
        this.loading.set(false);
      },
    });
  }

  guardar(data: PerfilProfesionalUpdateDto) {
    if (!this.id) return;
    this.saving.set(true);
    this.error.set(null);

    const dto = data as PerfilProfesionalUpdateDto;
    console.log('Data enviada al API:', JSON.stringify(dto, null, 2));

    this.perfilService.actualizar(this.id, dto).subscribe({
      next: (updated) => {
        console.log('Perfil actualizado:', updated);
        this.router.navigate(['/admin/profesionales']);
      },
      error: (err) => {
        console.error('Error al actualizar perfil:', err);
        this.error.set(err?.error?.message ?? this.translocoService.translate('error_actualizar_perfil'));
      },
      complete: () => {
        this.saving.set(false);
      },
    });
  }

  cancelar() {
    this.router.navigate(['/admin/profesionales']);
  }
}