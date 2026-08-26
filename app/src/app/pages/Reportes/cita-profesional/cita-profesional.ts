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
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTooltipModule } from '@angular/material/tooltip';

import { ReporteService } from '../../../core/services/reporte.service';
import { PerfilProfesionalService } from '../../../core/services/perfilProfesionalService';
import { AuthService } from '../../../core/services/auth.service';
import {
  ReporteCitasProfesionalResponse,
  ProfesionalCitasReporte,
} from '../../../core/models/reporte.model';
import { PerfilProfesional } from '../../../core/models/perfilProfesional.model';

@Component({
  selector: 'app-cita-profesional',
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
    MatDatepickerModule,
    MatNativeDateModule,
    MatSnackBarModule,
    MatTooltipModule,
  ],
  templateUrl: './cita-profesional.html',
  styleUrls: ['./cita-profesional.css'],
})
export class CitaProfesional implements OnInit {
  private readonly reporteService = inject(ReporteService);
  private readonly perfilService = inject(PerfilProfesionalService);
  private readonly authService = inject(AuthService);
  private readonly snackBar = inject(MatSnackBar);

  // Datos del reporte
  reporte = signal<ReporteCitasProfesionalResponse | null>(null);
  loading = signal(false);
  error = signal<string | null>(null);

  // Filtros
  fechaInicio = signal<string | null>(null);
  fechaFin = signal<string | null>(null);
  idProfesional = signal<number | null>(null);

  // Datos para selects
  profesionales = signal<PerfilProfesional[]>([]);
  cargandoFiltros = signal(false);

  // Usuario actual
  usuario = this.authService.usuario;
  rol = this.authService.rol;
  esAdmin = computed(() => this.rol() === 'ADMIN');
  esProfesional = computed(() => this.rol() === 'PROFESIONAL');

  // Computed
  profesionalesData = computed(() => this.reporte()?.profesionales || []);
  filtrosAplicados = computed(() => this.reporte()?.filtrosAplicados);
  hayDatos = computed(() => this.reporte() !== null && this.profesionalesData().length > 0);
  totalProfesionales = computed(() => this.profesionalesData().length);

  ngOnInit(): void {
    this.cargarFiltros();
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
    // Validar rango de fechas
    if (this.fechaInicio() && this.fechaFin()) {
      const inicio = new Date(this.fechaInicio()!);
      const fin = new Date(this.fechaFin()!);
      if (inicio > fin) {
        this.snackBar.open('La fecha de inicio no puede ser mayor que la fecha de fin', 'Cerrar', {
          duration: 3000,
        });
        return;
      }
    }

    this.loading.set(true);
    this.error.set(null);

    const filtros = {
      fechaInicio: this.fechaInicio() || undefined,
      fechaFin: this.fechaFin() || undefined,
      idProfesional: this.idProfesional() || undefined,
    };

    this.reporteService.obtenerCitasPorProfesional(filtros).subscribe({
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
    this.fechaInicio.set(null);
    this.fechaFin.set(null);
    if (this.esAdmin()) {
      this.idProfesional.set(null);
    }
    this.generarReporte();
  }

  getColorPorcentaje(porcentaje: number): string {
    if (porcentaje >= 80) return '#4caf50';
    if (porcentaje >= 50) return '#ff9800';
    return '#f44336';
  }

  getIconoPorcentaje(porcentaje: number): string {
    if (porcentaje >= 80) return 'check_circle';
    if (porcentaje >= 50) return 'warning';
    return 'error';
  }
}