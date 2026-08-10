import {
  Component,
  computed,
  effect,
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

import {
  Servicio,
  ServicioCreateDto,
  ServicioFormModel,
  ServicioUpdateDto
} from '../../../core/models/servicio.model';
import { PerfilProfesional } from '../../../core/models/perfilProfesional.model';
import { Categoria } from '../../../core/models/categoria.model';
import { Modalidad } from '../../../core/models/modalidad.model';
import { Especialidad } from '../../../core/models/especialidad.model';
import { TranslocoModule } from '@jsverse/transloco';

@Component({
  selector: 'app-servicio-form',
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
    TranslocoModule
  ],
  templateUrl: './servicio-form.html',
  styleUrl: './servicio-form.css'
})
export class ServicioForm {
  servicio = input<Servicio | null>(null);
  saving = input<boolean>(false);

  perfiles = input<PerfilProfesional[]>([]);
  categorias = input<Categoria[]>([]);
  modalidades = input<Modalidad[]>([]);
  especialidades = input<Especialidad[]>([]);

  guardar = output<ServicioCreateDto | ServicioUpdateDto>();
  cancelar = output<void>();

  servicioModel = signal<ServicioFormModel>({
    idPerfil: 0,
    idCategoria: 0,
    idModalidad: 0,
    nombre: '',
    descripcion: '',
    precio: 0,
    duracionEstimada: 0,
    estado: true,
    especialidadIds: []
  });

  servicioForm = form(this.servicioModel, (path) => {
    required(path.idPerfil, { message: 'Seleccione un profesional' });
    required(path.idCategoria, { message: 'Seleccione una categoría' });
    required(path.idModalidad, { message: 'Seleccione una modalidad' });

    required(path.nombre, { message: 'El nombre es obligatorio' });
    minLength(path.nombre, 3, { message: 'Mínimo 3 caracteres' });
    maxLength(path.nombre, 150, { message: 'Máximo 150 caracteres' });

    required(path.precio, { message: 'El precio es obligatorio' });
    min(path.precio, 1, { message: 'Debe ser mayor a 0' });

    required(path.duracionEstimada, { message: 'La duración es obligatoria' });
    min(path.duracionEstimada, 1, { message: 'Debe ser mayor a 0' });
  });

  isEdit = computed(() => this.servicio() !== null);
  isSubmitting = computed(() => this.saving());

  constructor() {
    effect(() => {
      const serv = this.servicio();
      if (!serv) {
        this.resetForm();
        return;
      }
      this.servicioModel.set({
        idPerfil: serv.idPerfil,
        idCategoria: serv.idCategoria,
        idModalidad: serv.idModalidad,
        nombre: serv.nombre ?? '',
        descripcion: serv.descripcion ?? '',
        precio: Number(serv.precio),
        duracionEstimada: serv.duracionEstimada ?? 0,
        estado: serv.estado ?? true,
        especialidadIds: serv.especialidades?.map((e) => e.idEspecialidad) ?? []
      });
    });
  }

  private resetForm() {
    this.servicioModel.set({
      idPerfil: 0,
      idCategoria: 0,
      idModalidad: 0,
      nombre: '',
      descripcion: '',
      precio: 0,
      duracionEstimada: 0,
      estado: true,
      especialidadIds: []
    });
  }

  private marcarCamposComoTocados() {
    this.servicioForm.idPerfil().markAsTouched();
    this.servicioForm.idCategoria().markAsTouched();
    this.servicioForm.idModalidad().markAsTouched();
    this.servicioForm.nombre().markAsTouched();
    this.servicioForm.precio().markAsTouched();
    this.servicioForm.duracionEstimada().markAsTouched();
  }

  private formularioInvalido(): boolean {
    return (
      this.servicioForm.idPerfil().invalid() ||
      this.servicioForm.idCategoria().invalid() ||
      this.servicioForm.idModalidad().invalid() ||
      this.servicioForm.nombre().invalid() ||
      this.servicioForm.precio().invalid() ||
      this.servicioForm.duracionEstimada().invalid()
    );
  }

  private emitirGuardar() {
    const dto = this.buildDto();
    console.log('JSON enviado al API:', JSON.stringify(dto, null, 2));
    this.guardar.emit(dto);
  }

  private buildDto(): ServicioCreateDto | ServicioUpdateDto {
    const value = this.servicioModel();
    return {
      idPerfil: value.idPerfil,
      idCategoria: value.idCategoria,
      idModalidad: value.idModalidad,
      nombre: value.nombre.trim(),
      descripcion: value.descripcion?.trim() ?? '',
      precio: Number(value.precio),
      duracionEstimada: Number(value.duracionEstimada),
      estado: value.estado,
      especialidadIds: value.especialidadIds
    };
  }

  submit() {
    this.marcarCamposComoTocados();
    if (this.formularioInvalido()) return;

    if (this.isEdit()) {
      const dto: ServicioUpdateDto = this.buildDto() as ServicioUpdateDto;
      this.guardar.emit(dto);
    } else {
      const dto: ServicioCreateDto = this.buildDto() as ServicioCreateDto;
      this.guardar.emit(dto);
    }
  }
}