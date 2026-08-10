import {
  Component,
  computed,
  input,
  output,
  signal
} from '@angular/core';

import { CommonModule } from '@angular/common';

import {
  FormField,
  form,
  required,
  minLength,
  maxLength,
  validate
} from '@angular/forms/signals';

import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';

import {
  CitaCreateDto,
  CitaFormModel
} from '../../../core/models/cita.model';

import { Usuario } from '../../../core/models/usuario.model';

import {
  PerfilProfesional
} from '../../../core/models/perfilProfesional.model';

import { Servicio } from '../../../core/models/servicio.model';
import { Modalidad } from '../../../core/models/modalidad.model';

import { TranslocoModule } from '@jsverse/transloco';

@Component({
  selector: 'app-cita-form',
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
    TranslocoModule
  ],

  templateUrl: './cita-form.html',
  styleUrl: './cita-form.css'
})
export class CitaForm {

  clientes = input<Usuario[]>([]);

  profesionales =
    input<PerfilProfesional[]>([]);

  servicios = input<Servicio[]>([]);

  modalidades = input<Modalidad[]>([]);

  saving = input<boolean>(false);

  guardar = output<CitaCreateDto>();

  cancelar = output<void>();

  citaModel = signal<CitaFormModel>({
    idCliente: null,
    idProfesional: null,
    idServicio: null,
    idModalidad: null,

    fechaCita: '',
    horaInicio: '',
    horaFin: '',

    comentarioCliente: '',
    montoEstimado: null
  });

  citaForm = form(
  this.citaModel,
  (path) => {
    required(path.idCliente, { message: 'Seleccione un cliente' });
    required(path.idProfesional, { message: 'Seleccione un profesional' });
    required(path.idServicio, { message: 'Seleccione un servicio' });
    required(path.idModalidad, { message: 'Seleccione una modalidad' });

    required(path.fechaCita, { message: 'La fecha es obligatoria' });
    required(path.horaInicio, { message: 'La hora de inicio es obligatoria' });
    required(path.horaFin, { message: 'La hora final es obligatoria' });

    required(path.comentarioCliente, { message: 'El comentario es obligatorio' });
    minLength(path.comentarioCliente, 10, { message: 'El comentario debe tener al menos 10 caracteres' });
    maxLength(path.comentarioCliente, 500, { message: 'El comentario no puede superar los 500 caracteres' });

    // Validación de fecha
    validate(path.fechaCita, (ctx) => {
      const valor = ctx.value();
      if (!valor) return undefined;

      const fechaSeleccionada = new Date(`${valor}T00:00:00`);
      const hoy = new Date();
      hoy.setHours(0, 0, 0, 0);

      if (fechaSeleccionada < hoy) {
        return { kind: 'fechaPasada', message: 'La fecha de la cita no puede estar en el pasado' };
      }
      return undefined;
    });

    // Validación de hora final
    validate(path.horaFin, (ctx) => {
      const horaFin = ctx.value();
      const horaInicio = this.citaModel().horaInicio;

      if (!horaInicio || !horaFin) return undefined;

      if (horaFin <= horaInicio) {
        return { kind: 'horaInvalida', message: 'La hora final debe ser posterior a la hora inicial' };
      }
      return undefined; 
    });

    // Validación de monto estimado
    validate(path.montoEstimado, (ctx) => {
      const valor = ctx.value();
      if (valor !== null && valor < 0) {
        return { kind: 'montoInvalido', message: 'El monto debe ser mayor o igual a 0' };
      }
      return undefined;
    });
  }
);


  isSubmitting = computed(
    () => this.saving()
  );

  submit() {

    if (this.isSubmitting()) {
      return;
    }

    this.marcarCamposComoTocados();

    if (this.formularioInvalido()) {
      return;
    }

    const dto = this.buildDto();

    console.log(
      'JSON enviado al API:',
      JSON.stringify(dto, null, 2)
    );

    this.guardar.emit(dto);
  }

  private marcarCamposComoTocados() {

    this.citaForm.idCliente()
      .markAsTouched();

    this.citaForm.idProfesional()
      .markAsTouched();

    this.citaForm.idServicio()
      .markAsTouched();

    this.citaForm.idModalidad()
      .markAsTouched();

    this.citaForm.fechaCita()
      .markAsTouched();

    this.citaForm.horaInicio()
      .markAsTouched();

    this.citaForm.horaFin()
      .markAsTouched();

    this.citaForm.comentarioCliente()
      .markAsTouched();
  }

  private formularioInvalido(): boolean {

    return (
      this.citaForm.idCliente().invalid() ||
      this.citaForm.idProfesional().invalid() ||
      this.citaForm.idServicio().invalid() ||
      this.citaForm.idModalidad().invalid() ||
      this.citaForm.fechaCita().invalid() ||
      this.citaForm.horaInicio().invalid() ||
      this.citaForm.horaFin().invalid() ||
      this.citaForm.comentarioCliente().invalid()
    );
  }

  private buildDto(): CitaCreateDto {

    const value = this.citaModel();

    /*
     * Prisma espera DateTime en:
     * fechaCita, horaInicio y horaFin.
     *
     * Por eso combinamos la fecha con cada hora
     * y enviamos valores ISO completos.
     */

    const fechaCita =
      new Date(
        `${value.fechaCita}T00:00:00`
      ).toISOString();

    const horaInicio =
      new Date(
        `${value.fechaCita}T${value.horaInicio}:00`
      ).toISOString();

    const horaFin =
      new Date(
        `${value.fechaCita}T${value.horaFin}:00`
      ).toISOString();

    return {
      idCliente: Number(value.idCliente),

      idProfesional:
        Number(value.idProfesional),

      idServicio:
        Number(value.idServicio),

      idModalidad:
        Number(value.idModalidad),

      fechaCita,
      horaInicio,
      horaFin,

      comentarioCliente:
        value.comentarioCliente.trim(),

      montoEstimado:
        value.montoEstimado !== null
          ? Number(value.montoEstimado)
          : null
    };
  }

  getNombreCliente(cliente: Usuario): string {

    const item = cliente as any;

    const nombre =
      item.nombre ??
      item.nombreCompleto ??
      item.usuario?.nombre ??
      '';

    const apellidos =
      item.apellidos ??
      item.apellido ??
      item.usuario?.apellidos ??
      '';

    const resultado =
      `${nombre} ${apellidos}`.trim();

    return resultado || `Cliente #${cliente.id}`;
  }

  getNombreProfesional(
    profesional: PerfilProfesional
  ): string {

    const item = profesional as any;

    const nombre =
      item.usuario?.nombre ??
      item.nombre ??
      '';

    const apellidos =
      item.usuario?.apellidos ??
      item.usuario?.apellido ??
      item.apellidos ??
      '';

    const resultado =
      `${nombre} ${apellidos}`.trim();

    return resultado ||
      `Profesional #${profesional.id}`;
  }

  getNombreServicio(
    servicio: Servicio
  ): string {

    const item = servicio as any;

    return (
      item.nombre ??
      item.titulo ??
      `Servicio #${servicio.id}`
    );
  }

  getNombreModalidad(
    modalidad: Modalidad
  ): string {

    const item = modalidad as any;

    return (
      item.nombre ??
      item.descripcion ??
      `Modalidad #${modalidad.id}`
    );
  }
}