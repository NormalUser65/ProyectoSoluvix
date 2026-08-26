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

import { ReporteService } from '../../../core/services/reporte.service';
import { PerfilProfesionalService } from '../../../core/services/perfilProfesionalService';
import { CategoriaService } from '../../../core/services/Categoria.Service';
import { ReporteCitasEstadoResponse, EstadoCount } from '../../../core/models/reporte.model';
import { PerfilProfesional } from '../../../core/models/perfilProfesional.model';
import { Categoria } from '../../../core/models/categoria.model';

@Component({
  selector: 'app-cita-estado',
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
  ],
  templateUrl: './cita-estado.html',
  styleUrls: ['./cita-estado.css'],
})
export class CitaEstado implements OnInit {
  private readonly reporteService = inject(ReporteService);
  private readonly perfilService = inject(PerfilProfesionalService);
  private readonly categoriaService = inject(CategoriaService);
  private readonly snackBar = inject(MatSnackBar);

  reporte = signal<ReporteCitasEstadoResponse | null>(null);
  loading = signal(false);
  error = signal<string | null>(null);

  // Filtros
  fechaInicio = signal<string | null>(null);
  fechaFin = signal<string | null>(null);
  idProfesional = signal<number | null>(null);
  idCategoria = signal<number | null>(null);

  profesionales = signal<PerfilProfesional[]>([]);
  categorias = signal<Categoria[]>([]);
  cargandoFiltros = signal(false);

  // Computed
  totalGeneral = computed(() => this.reporte()?.totalGeneral || 0);
  totalPorEstado = computed(() => this.reporte()?.totalPorEstado || []);
  filtrosAplicados = computed(() => this.reporte()?.filtrosAplicados);
  hayDatos = computed(() => this.reporte() !== null && this.totalGeneral() > 0);

  ngOnInit(): void {
    this.cargarFiltros();
    this.generarReporte();
  }

  cargarFiltros(): void {
    this.cargandoFiltros.set(true);

    Promise.all([
      new Promise<void>((resolve) => {
        this.perfilService.listar().subscribe({
          next: (response) => {
            this.profesionales.set(response.data || []);
            resolve();
          },
          error: () => resolve(),
        });
      }),
      new Promise<void>((resolve) => {
        this.categoriaService.listar().subscribe({
          next: (response) => {
            this.categorias.set(response.data || []);
            resolve();
          },
          error: () => resolve(),
        });
      }),
    ]).finally(() => {
      this.cargandoFiltros.set(false);
    });
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
      idCategoria: this.idCategoria() || undefined,
    };

    this.reporteService.obtenerCitasPorEstado(filtros).subscribe({
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
    this.idProfesional.set(null);
    this.idCategoria.set(null);
    this.generarReporte();
  }

  getColorEstado(estado: string): string {
    const colores: Record<string, string> = {
      PENDIENTE: '#ff9800',
      ACEPTADA: '#2196f3',
      RECHAZADA: '#f44336',
      CANCELADA: '#9e9e9e',
      COMPLETADA: '#4caf50',
    };
    return colores[estado] || '#757575';
  }

  getIconoEstado(estado: string): string {
    const iconos: Record<string, string> = {
      PENDIENTE: 'pending',
      ACEPTADA: 'check_circle',
      RECHAZADA: 'cancel',
      CANCELADA: 'block',
      COMPLETADA: 'done_all',
    };
    return iconos[estado] || 'help';
  }
}
