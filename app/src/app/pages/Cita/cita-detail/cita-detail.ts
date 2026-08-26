import { Component, inject, signal, computed } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';

import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

import { CitaService } from '../../../core/services/Cita.Service';
import { ResenaService } from '../../../core/services/resena.service';
import { AuthService } from '../../../core/services/auth.service';
import { Cita } from '../../../core/models/cita.model';
import { Resena } from '../../../core/models/resena.model';
import { MatChipsModule } from '@angular/material/chips';
import { DatePipe, CommonModule } from '@angular/common';

@Component({
  selector: 'app-servicio-detail',
  imports: [
    MatButtonModule,
    MatCardModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatChipsModule,
    DatePipe,
    RouterLink,
    MatSnackBarModule,
    CommonModule,
  ],
  templateUrl: './cita-detail.html',
  styleUrls: ['./cita-detail.css'],
})
export class CitaDetail {
  private readonly route = inject(ActivatedRoute);
  private readonly citaService = inject(CitaService);
  private readonly resenaService = inject(ResenaService);
  private readonly authService = inject(AuthService);
  private readonly snackBar = inject(MatSnackBar);

  cita = signal<Cita | null>(null);
  resena = signal<Resena | null>(null);
  loading = signal(false);
  loadingResena = signal(false);
  error = signal<string | null>(null);

  tieneResena = computed(() => this.resena() !== null);

  estaCompletada = computed(() => {
    const estado = this.cita()?.estado?.nombre;
    return estado?.toUpperCase() === 'COMPLETADA';
  });

  esClientePropietario = computed(() => {
    const usuario = this.authService.usuario();
    const cita = this.cita();
    return usuario && cita && usuario.id === cita.idCliente;
  });

  puedeResenar = computed(() => {
    return this.estaCompletada() && this.esClientePropietario() && !this.tieneResena();
  });

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));

    if (!id) {
      this.error.set('ID inválido');
      return;
    }

    this.loadCita(id);
    this.cargarResena(id);
  }

  loadCita(id: number): void {
    this.loading.set(true);
    this.error.set(null);

    this.citaService.obtenerPorId(id).subscribe({
      next: (response) => {
        this.cita.set(response.data);
        this.loading.set(false);
      },
      error: () => {
        this.error.set('No se pudo cargar la cita');
        this.loading.set(false);
      },
    });
  }

  cargarResena(id: number): void {
    this.loadingResena.set(true);
    this.resenaService.obtenerPorCita(id).subscribe({
      next: (response) => {
        this.resena.set(response.data || null);
        this.loadingResena.set(false);
      },
      error: () => {
        this.resena.set(null);
        this.loadingResena.set(false);
      },
    });
  }

  irACrearResena(): void {
    const citaId = this.cita()?.id;
    if (citaId) {
      window.location.href = `/resenas/create/${citaId}`;
    }
  }
}
