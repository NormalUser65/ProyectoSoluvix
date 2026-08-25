import { Component, computed, effect, inject, input, output, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormField, form, required, min, minLength, maxLength } from '@angular/forms/signals';

import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { DialogService } from '../../../core/services/dialog.Service';

import {
  PerfilProfesional,
  PerfilProfesionalCreateDto,
  PerfilProfesionalFormModel,
  PerfilProfesionalUpdateDto,
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
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatSelectModule,
    MatSlideToggleModule,
  ],
  templateUrl: './perfilProfesional-form.html',
  styleUrl: './perfilProfesional-form.css',
})
export class PerfilProfesionalForm {
  perfil = input<PerfilProfesional | null>(null);
  saving = input<boolean>(false);

  usuarios = input<Usuario[]>([]);

  modalidades = input<Modalidad[]>([]);
  especialidades = input<Especialidad[]>([]);
  private readonly imageService = inject(ImageService);

  guardar = output<PerfilProfesionalCreateDto | PerfilProfesionalUpdateDto>();
  cancelar = output<void>();

  especialidadesDisponibles = computed(() => {
    const todas = this.especialidades();
    const perfilEditando = this.perfil();

    if (perfilEditando) {
      return todas;
    }

    return todas.filter((esp) => esp.estado === true);
  });

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
    especialidadIds: [],
  });

  perfilForm = form(this.perfilModel, (path) => {
    required(path.tituloProfesional, { message: 'El título profesional es obligatorio' });
    minLength(path.tituloProfesional, 3, { message: 'Mínimo 3 caracteres' });
    maxLength(path.tituloProfesional, 150, { message: 'Máximo 150 caracteres' });

    required(path.descripcion, { message: 'La descripción es obligatoria' });
    minLength(path.descripcion, 20, { message: 'Debe tener mínimo 20 caracteres' });
    maxLength(path.descripcion, 500, { message: 'Máximo 500 caracteres' });

    required(path.annosExperiencia, { message: 'Los años de experiencia son obligatorios' });
    min(path.annosExperiencia, 0, { message: 'No puede ser negativo' });

    required(path.tarifaBase, { message: 'La tarifa base es obligatoria' });
    min(path.tarifaBase, 1, { message: 'Debe ser mayor a 0' });

    required(path.idModalidad, { message: 'Seleccione una modalidad' });
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
        especialidadIds: prof.especialidades?.map((e) => e.id) ?? [],
      });
      this.selectedImageFile.set(null);
      this.imagePreview.set(
        prof.imagenPerfil ? this.imageService.getImageUrl(prof.imagenPerfil) : null,
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
      especialidadIds: [],
    });
    this.selectedImageFile.set(null);
    this.imagePreview.set(null);
  }


  private readonly dialogService = inject(DialogService);

  onImageSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (!file) return;

    // Validación de tipo de archivo
    const tiposPermitidos = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
    if (!tiposPermitidos.includes(file.type)) {
      this.dialogService
        .confirmar(
          'Solo se permiten archivos de imagen (JPEG, PNG, WEBP, GIF)',
          'Formato no válido',
          'normal',
        )
        .subscribe(() => {
          input.value = '';
        });
      return;
    }

    const maxSizeInMB = 5;
    const maxSizeInBytes = maxSizeInMB * 1024 * 1024;

    if (file.size > maxSizeInBytes) {
      this.dialogService
        .confirmar(
          `La imagen es demasiado grande. El tamaño máximo permitido es ${maxSizeInMB}MB.`,
          'Imagen demasiado grande',
          'peligro',
        )
        .subscribe(() => {
          input.value = '';
        });
      return;
    }

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
          imagenPerfil: response.fileName,
        }));
        this.selectedImageFile.set(null);
        this.emitirGuardar();
      },
      error: () => {
        alert('No se pudo subir la imagen');
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
      especialidadIds: value.especialidadIds,
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
