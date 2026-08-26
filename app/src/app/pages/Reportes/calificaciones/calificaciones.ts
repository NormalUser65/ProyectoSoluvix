import { Component, inject, signal, computed, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatChipsModule } from '@angular/material/chips';

import { ReporteService } from '../../../core/services/reporte.service';
import { PerfilProfesionalService } from '../../../core/services/perfilProfesionalService';
import { AuthService } from '../../../core/services/auth.service';
import {
  ReporteCalificacionesResponse,
  ServicioCalificacion,
} from '../../../core/models/reporte.model';
import { PerfilProfesional } from '../../../core/models/perfilProfesional.model';

@Component({
  selector: 'app-calificaciones',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatSnackBarModule,
    MatTooltipModule,
    MatChipsModule,
  ],
  templateUrl: './calificaciones.html',
  styleUrls: ['./calificaciones.css'],
})
export class Calificaciones implements OnInit {
  private readonly reporteService = inject(ReporteService);
  private readonly perfilService = inject(PerfilProfesionalService);
  private readonly authService = inject(AuthService);
  private readonly snackBar = inject(MatSnackBar);

  // Datos del reporte
  reporte = signal<ReporteCalificacionesResponse | null>(null);
  loading = signal(false);
  error = signal<string | null>(null);

  // Filtros
  idProfesional = signal<number | null>(null);
  umbralBajaCalificacion = signal<number>(2.5);

  // Datos para selects
  profesionales = signal<PerfilProfesional[]>([]);
  cargandoFiltros = signal(false);

  // Usuario actual
  usuario = this.authService.usuario;
  rol = this.authService.rol;
  esAdmin = computed(() => this.rol() === 'ADMIN');
  esProfesional = computed(() => this.rol() === 'PROFESIONAL');

  // Computed
  profesionalData = computed(() => this.reporte()?.profesional);
  mejorServicio = computed(() => this.reporte()?.mejorServicio);
  serviciosBajaCalificacion = computed(() => this.reporte()?.serviciosBajaCalificacion || []);
  todosServicios = computed(() => this.reporte()?.todosServicios || []);
  umbralActual = computed(() => this.reporte()?.umbralBajaCalificacion || 2.5);
  hayDatos = computed(() => this.reporte() !== null && this.profesionalData() !== undefined);

  ngOnInit(): void {
  this.cargarFiltros();
  
  if (this.esAdmin() && this.profesionales().length > 0) {
    this.idProfesional.set(this.profesionales()[0].id);
  }
  
  this.generarReporte();
}

  cargarFiltros(): void {
    // Solo ADMIN necesita la lista de profesionales
    if (this.esAdmin()) {
      this.cargandoFiltros.set(true);
      this.perfilService.listar().subscribe({
        next: (response) => {
          this.profesionales.set(response.data || []);
          this.cargandoFiltros.set(false);
        },
        error: () => {
          this.cargandoFiltros.set(false);
        },
      });
    }
  }

  generarReporte(): void {
    this.loading.set(true);
    this.error.set(null);

    const filtros = {
      idProfesional: this.idProfesional() || undefined,
      umbralBajaCalificacion: this.umbralBajaCalificacion(),
    };

    this.reporteService.obtenerCalificaciones(filtros).subscribe({
      next: (response) => {
        this.reporte.set(response.data);
        this.loading.set(false);
      },
      error: (error) => {
        console.error('Error al generar reporte:', error);
        this.error.set(error.error?.message || 'No se pudo generar el reporte');
        this.loading.set(false);
        this.snackBar.open('Error al generar el reporte', 'Cerrar', { duration: 3000 });
      },
    });
  }

  limpiarFiltros(): void {
    if (this.esAdmin()) {
      this.idProfesional.set(null);
    }
    this.umbralBajaCalificacion.set(2.5);
    this.generarReporte();
  }

  getColorPromedio(promedio: number): string {
    if (promedio >= 4.5) return '#4caf50';
    if (promedio >= 3.5) return '#ff9800';
    if (promedio >= 2.5) return '#ffc107';
    return '#f44336';
  }

  getIconoPromedio(promedio: number): string {
    if (promedio >= 4.5) return 'star';
    if (promedio >= 3.5) return 'star_half';
    return 'star_border';
  }

  getEstrellas(promedio: number): number[] {
    const estrellas: number[] = [];
    const redondeado = Math.round(promedio);
    for (let i = 0; i < 5; i++) {
      if (i < redondeado) {
        estrellas.push(1);
      } else {
        estrellas.push(0);
      }
    }
    return estrellas;
  }

  getStatusLabel(promedio: number): string {
    if (promedio >= 4.5) return 'Excelente';
    if (promedio >= 3.5) return 'Bueno';
    if (promedio >= 2.5) return 'Regular';
    return 'Bajo';
  }

  getStatusColor(promedio: number): string {
    if (promedio >= 4.5) return '#4caf50';
    if (promedio >= 3.5) return '#ff9800';
    if (promedio >= 2.5) return '#ffc107';
    return '#f44336';
  }

  isBajaCalificacion(promedio: number): boolean {
    return promedio < this.umbralActual();
  }
}
