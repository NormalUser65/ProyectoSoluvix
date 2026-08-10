import {
  Component,
  computed,
  effect,
  inject,
  input,
  output,
  signal
} from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormField,
  form,
  required,
  min,
  minLength,
  maxLength
} from '@angular/forms/signals';

import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { TranslocoModule, TranslocoService } from '@jsverse/transloco';

import {
  PerfilProfesional,
  PerfilProfesionalCreateDto,
  PerfilProfesionalFormModel,
  PerfilProfesionalUpdateDto
} from '../../../core/models/perfilProfesional.model';
import { Modalidad } from '../../../core/models/modalidad.model';
import { Especialidad } from '../../../core/models/especialidad.model';
import { ImageService } from '../../../core/services/image.service';
import { Usuario } from '../../../core/models/usuario.model';

@Component({
  selector: 'app-perfil-profesional-form',
  standalone: true,
  imports: [
    CommonModule,
    FormField,
    TranslocoModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatSelectModule,
    MatSlideToggleModule
  ],
  templateUrl: './perfilProfesional-form.html',
  styleUrl: './perfilProfesional-form.css'
})
export class PerfilProfesionalForm {
  private readonly translocoService = inject(TranslocoService);

  perfil = input<PerfilProfesional | null>(null);
  saving = input<boolean>(false);

  usuarios = input<Usuario[]>([]);

  modalidades = input<Modalidad[]>([]);
  especialidades = input<Especialidad[]>([]);
  private readonly imageService = inject(ImageService);

  guardar = output<PerfilProfesionalCreateDto | PerfilProfesionalUpdateDto>();
  cancelar = output<void>();

  uploadingImage = signal(false);
  imagePreview = signal<string | null>(null);
  selectedImageFile = signal<File | null>(null);

  perfilModel = signal<PerfilProfesionalFormModel>({
    idUsuario: 0,
    tituloProfesional: '',
    descripcion: '',
    annosExperiencia: 0,
    idModalidad: null,
    provincia: '',
    canton: '',
    distrito: '',
    tarifaBase: 0,
    disponible: true,
    imagenPerfil: '',
    especialidadIds: []
  });

  perfilForm = form(this.perfilModel, (path) => {
    required(path.tituloProfesional, { message: this.translocoService.translate('titulo_profesional_required') });
    minLength(path.tituloProfesional, 3, { message: this.translocoService.translate('titulo_profesional_min') });
    maxLength(path.tituloProfesional, 150, { message: this.translocoService.translate('titulo_profesional_max') });

    required(path.descripcion, { message: this.translocoService.translate('descripcion_required') });
    minLength(path.descripcion, 20, { message: this.translocoService.translate('descripcion_min') });
    maxLength(path.descripcion, 500, { message: this.translocoService.translate('descripcion_max') });

    required(path.annosExperiencia, { message: this.translocoService.translate('experiencia_required') });
    min(path.annosExperiencia, 0, { message: this.translocoService.translate('experiencia_min') });

    required(path.tarifaBase, { message: this.translocoService.translate('tarifa_required') });
    min(path.tarifaBase, 1, { message: this.translocoService.translate('tarifa_min') });

    required(path.idModalidad, { message: this.translocoService.translate('modalidad_required') });
  });

  isEdit = computed(() => this.perfil() !== null);
  isSubmitting = computed(() => this.saving() || this.uploadingImage());

  constructor() {
    effect(() => {
      const prof = this.perfil();
      if (!prof) {
        this.resetForm();
        return;
      }
      this.perfilModel.set({
        idUsuario: prof.idUsuario,
        tituloProfesional: prof.tituloProfesional ?? '',
        descripcion: prof.descripcion ?? '',
        annosExperiencia: prof.annosExperiencia ?? 0,
        idModalidad: prof.idModalidad ?? null,
        provincia: prof.provincia ?? '',
        canton: prof.canton ?? '',
        distrito: prof.distrito ?? '',
        tarifaBase: prof.tarifaBase ?? 0,
        disponible: prof.disponible ?? true,
        imagenPerfil: prof.imagenPerfil ?? '',
        especialidadIds: prof.especialidades?.map((e) => e.id) ?? []
      });
      this.selectedImageFile.set(null);
      this.imagePreview.set(
        prof.imagenPerfil ? this.imageService.getImageUrl(prof.imagenPerfil) : null
      );
    });
  }

  private resetForm() {
    this.perfilModel.set({
      idUsuario: 0,
      tituloProfesional: '',
      descripcion: '',
      annosExperiencia: 0,
      idModalidad: null,
      provincia: '',
      canton: '',
      distrito: '',
      tarifaBase: 0,
      disponible: true,
      imagenPerfil: '',
      especialidadIds: []
    });
    this.selectedImageFile.set(null);
    this.imagePreview.set(null);
  }

  onImageSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (!file) return;
    this.selectedImageFile.set(file);
    this.imagePreview.set(URL.createObjectURL(file));
  }

  private marcarCamposComoTocados() {
    this.perfilForm.tituloProfesional().markAsTouched();
    this.perfilForm.descripcion().markAsTouched();
    this.perfilForm.annosExperiencia().markAsTouched();
    this.perfilForm.tarifaBase().markAsTouched();
    this.perfilForm.idModalidad().markAsTouched();
  }

  private formularioInvalido(): boolean {
    return (
      this.perfilForm.tituloProfesional().invalid() ||
      this.perfilForm.descripcion().invalid() ||
      this.perfilForm.annosExperiencia().invalid() ||
      this.perfilForm.tarifaBase().invalid() ||
      this.perfilForm.idModalidad().invalid()
    );
  }

  private subirImagenYGuardar(file: File) {
    this.uploadingImage.set(true);
    this.imageService.upload(file).subscribe({
      next: (response) => {
        this.perfilModel.update((value) => ({
          ...value,
          imagenPerfil: response.fileName
        }));
        this.selectedImageFile.set(null);
        this.emitirGuardar();
      },
      error: () => {
        alert(this.translocoService.translate('error_subir_imagen'));
      },
      complete: () => {
        this.uploadingImage.set(false);
      },
    });
  }

  private emitirGuardar() {
    const dto = this.buildDto();
    console.log('JSON enviado al API:', JSON.stringify(dto, null, 2));
    this.guardar.emit(dto);
  }

  private buildDto(): PerfilProfesionalCreateDto | PerfilProfesionalUpdateDto {
    const value = this.perfilModel();
    return {
      idUsuario: value.idUsuario!, 
      tituloProfesional: value.tituloProfesional.trim(),
      descripcion: value.descripcion.trim(),
      annosExperiencia: Number(value.annosExperiencia),
      idModalidad: value.idModalidad!,
      provincia: value.provincia.trim(),
      canton: value.canton.trim(),
      distrito: value.distrito.trim(),
      tarifaBase: Number(value.tarifaBase),
      disponible: value.disponible,
      imagenPerfil: value.imagenPerfil?.trim() ?? '',
      especialidadIds: value.especialidadIds
    };
  }

  submit() {
    this.marcarCamposComoTocados();
    if (this.formularioInvalido()) return;

    const file = this.selectedImageFile();
    if (file) {
      this.subirImagenYGuardar(file);
      return;
    }

    if (this.isEdit()) {
      const dto: PerfilProfesionalUpdateDto = this.buildDto() as PerfilProfesionalUpdateDto;
      this.guardar.emit(dto);
    } else {
      const dto: PerfilProfesionalCreateDto = this.buildDto() as PerfilProfesionalCreateDto;
      this.guardar.emit(dto);
    }
  }
}