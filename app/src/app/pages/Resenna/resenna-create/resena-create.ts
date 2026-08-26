import { Component, inject, signal, computed, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';

import { ResenaService } from '../../../core/services/resena.service';
import { CitaService } from '../../../core/services/Cita.Service';
import { AuthService } from '../../../core/services/auth.service';
import { Cita } from '../../../core/models/cita.model';
import { Usuario } from '../../../core/models/usuario.model';

@Component({
  selector: 'app-resena-create',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterLink,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatSnackBarModule,
    MatProgressSpinnerModule,
    MatSelectModule,
  ],
  templateUrl: './resena-create.html',
  styleUrls: ['./resena-create.css'],
})
export class ResenaCreate implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly resenaService = inject(ResenaService);
  private readonly citaService = inject(CitaService);
  private readonly authService = inject(AuthService);
  private readonly fb = inject(FormBuilder);
  private readonly snackBar = inject(MatSnackBar);

  citaId = signal<number>(0);
  cita = signal<Cita | null>(null);
  loading = signal(false);
  error = signal<string | null>(null);
  cliente = signal<Usuario | null>(null);

  resenaForm!: FormGroup;
  puntuaciones = [1, 2, 3, 4, 5];

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    if (!id) {
      this.snackBar.open('Cita no válida', 'Cerrar', { duration: 3000 });
      this.router.navigate(['/citas']);
      return;
    }

    this.citaId.set(id);
    this.inicializarFormulario();
    this.cargarCita();
  }

  inicializarFormulario(): void {
    this.resenaForm = this.fb.group({
      puntuacion: [null, [Validators.required, Validators.min(1), Validators.max(5)]],
      comentario: ['', [Validators.maxLength(500)]],
    });
  }

  cargarCita(): void {
    this.loading.set(true);
    this.error.set(null);

    this.citaService.obtenerPorId(this.citaId()).subscribe({
      next: (response) => {
        const cita = response.data;
        this.cita.set(cita);
        this.validarCita(cita);
        this.loading.set(false);
      },
      error: () => {
        this.error.set('No se pudo cargar la información de la cita');
        this.loading.set(false);
        this.snackBar.open('Error al cargar la cita', 'Cerrar', { duration: 3000 });
      },
    });
  }

  validarCita(cita: Cita): void {
    // Validar que la cita esté completada
    const estadoNormalizado = cita.estado?.nombre?.toUpperCase().trim();
    if (estadoNormalizado !== 'COMPLETADA') {
      this.error.set('Solo se puede registrar reseña en citas completadas');
      this.snackBar.open('La cita debe estar completada para reseñar', 'Cerrar', { duration: 3000 });
      return;
    }

    // Validar que el cliente autenticado sea el cliente de la cita
    const usuarioActual = this.authService.usuario();
    if (!usuarioActual) {
      this.error.set('Debes iniciar sesión para reseñar');
      this.snackBar.open('Debes iniciar sesión', 'Cerrar', { duration: 3000 });
      return;
    }

    if (usuarioActual.id !== cita.idCliente) {
      this.error.set('No tienes permiso para reseñar esta cita');
      this.snackBar.open('Esta cita no te pertenece', 'Cerrar', { duration: 3000 });
      return;
    }

    this.cliente.set(usuarioActual);
  }

  enviarResena(): void {
    if (this.resenaForm.invalid) {
      this.resenaForm.markAllAsTouched();
      this.snackBar.open('Por favor, completa la puntuación', 'Cerrar', { duration: 3000 });
      return;
    }

    const formValue = this.resenaForm.value;
    const usuarioActual = this.authService.usuario();

    if (!usuarioActual) {
      this.snackBar.open('Debes iniciar sesión para reseñar', 'Cerrar', { duration: 3000 });
      return;
    }

    const dto = {
      idCita: this.citaId(),
      idCliente: usuarioActual.id,
      puntuacion: formValue.puntuacion,
      comentario: formValue.comentario?.trim() || null,
    };

    this.loading.set(true);
    this.resenaService.crear(dto).subscribe({
      next: () => {
        this.snackBar.open('¡Reseña registrada exitosamente!', 'Cerrar', { duration: 3000 });
        this.router.navigate(['/citas', this.citaId()]);
      },
      error: (error) => {
        const mensaje = error.error?.message || 'No se pudo registrar la reseña';
        this.snackBar.open(mensaje, 'Cerrar', { duration: 5000 });
        this.loading.set(false);
      },
    });
  }

  volver(): void {
    this.router.navigate(['/citas', this.citaId()]);
  }
}