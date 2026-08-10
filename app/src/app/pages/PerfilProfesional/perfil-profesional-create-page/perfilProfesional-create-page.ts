import { Component, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { forkJoin } from 'rxjs';
import { TranslocoModule, TranslocoService } from '@jsverse/transloco';
import { PerfilProfesionalForm } from '../../../shared/components/perfilProfesional-form/perfilProfesional-form';
import { PerfilProfesionalService } from '../../../core/services/perfilProfesionalService';
import { ModalidadService } from '../../../core/services/modalidad.service';
import { EspecialidadService } from '../../../core/services/especialidad.service';
import { UsuarioService } from '../../../core/services/usuario.service'; 
import { Modalidad } from '../../../core/models/modalidad.model';
import { Especialidad } from '../../../core/models/especialidad.model';
import { Usuario } from '../../../core/models/usuario.model'; 
import { PerfilProfesionalCreateDto, PerfilProfesionalUpdateDto } from '../../../core/models/perfilProfesional.model';

@Component({
  selector: 'app-perfil-profesional-create-page',
  standalone: true,
  imports: [PerfilProfesionalForm, TranslocoModule],
  templateUrl: './perfilProfesional-create-page.html',
  styleUrls: ['./perfilProfesional-create-page.css'],
})
export class PerfilProfesionalCreatePage {
  private readonly router = inject(Router);
  private readonly perfilService = inject(PerfilProfesionalService);
  private readonly modalidadService = inject(ModalidadService);
  private readonly especialidadService = inject(EspecialidadService);
  private readonly usuarioService = inject(UsuarioService);
  private readonly translocoService = inject(TranslocoService);

  usuarios = signal<Usuario[]>([]);
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
      usuarios: this.usuarioService.listar(),
      modalidades: this.modalidadService.listar(),
      especialidades: this.especialidadService.listar(),
    }).subscribe({
      next: ({ usuarios, modalidades, especialidades }) => {
        this.usuarios.set(
          (usuarios.data ?? []).filter(u => u.rol?.id === 2 && !u.perfilProfesional)
        );
        this.modalidades.set(modalidades.data ?? []);
        this.especialidades.set(especialidades.data ?? []);
      },
      error: (err) => {
        console.error('Error al cargar datos del formulario:', err);
        this.error.set(this.translocoService.translate('error_carga_datos_form'));
      },
      complete: () => {
        this.loading.set(false);
      },
    });
  }

  guardar(data: PerfilProfesionalCreateDto | PerfilProfesionalUpdateDto) {
    this.saving.set(true);
    this.error.set(null);

    const dto = data as PerfilProfesionalCreateDto;

    console.log('Data enviada al API:', JSON.stringify(dto, null, 2));

    this.perfilService.crear(dto).subscribe({
      next: () => {
        this.router.navigate(['/admin/profesionales']);
      },
      error: (err) => {
        console.error('Error al registrar perfil:', err);
        this.error.set(err?.error?.message ?? this.translocoService.translate('error_registrar_perfil'));
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