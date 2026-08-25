import { Component, inject, signal, computed } from '@angular/core'; 
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';

import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatFormFieldModule } from '@angular/material/form-field'; 
import { MatInputModule } from '@angular/material/input'; 

import { EspecialidadService } from '../../../core/services/especialidad.service';
import { DialogService } from '../../../core/services/dialog.Service'; 
import { Especialidad } from '../../../core/models/especialidad.model';

@Component({
  selector: 'app-especialidad-list',
  imports: [
    RouterLink,
    FormsModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatTooltipModule,
    MatFormFieldModule, 
    MatInputModule, 
  ],
  templateUrl: './especialidad-list.html',
  styleUrls: ['./especialidad-list.css'],
})
export class EspecialidadList {
  private readonly especialidadService = inject(EspecialidadService);
  private readonly dialogService = inject(DialogService); 

  especialidades = signal<Especialidad[]>([]);
  search = signal(''); // NUEVO
  loading = signal(false);
  error = signal<string | null>(null);

  // Filtrar especialidades según búsqueda 
  especialidadesFiltradas = computed(() => {
    const texto = this.search().trim().toLowerCase();
    return this.especialidades().filter((esp) => {
      const nombre = esp.nombre?.toLowerCase() ?? '';
      const descripcion = esp.descripcion?.toLowerCase() ?? '';
      return (
        texto.length === 0 ||
        nombre.includes(texto) ||
        descripcion.includes(texto)
      );
    });
  });

  totalEspecialidades = computed(() => this.especialidadesFiltradas().length); // NUEVO

  ngOnInit(): void {
    this.loadEspecialidades();
  }

  // Cargar especialidades
  loadEspecialidades(): void {
    this.loading.set(true);
    this.error.set(null);

    this.especialidadService.listar().subscribe({
      next: (response) => {
        this.especialidades.set(response.data);
        this.loading.set(false);
      },
      error: () => {
        this.error.set('No se pudieron cargar las especialidades');
        this.loading.set(false);
      },
    });
  }

  // Limpiar filtros 
  clearFilters(): void {
    this.search.set('');
  }

  // Cambiar estado con confirmación 
  toggleEstado(especialidad: Especialidad): void {
    const accion = especialidad.estado ? 'desactivar' : 'activar';
    const mensaje = `¿Estás seguro de que deseas ${accion} la especialidad "${especialidad.nombre}"?`;
    const tipo = especialidad.estado ? 'peligro' : 'normal';
    
    this.dialogService.confirmar(mensaje, 'Confirmar acción', tipo).subscribe(confirmed => {
      if (confirmed) {
        this.ejecutarCambioEstado(especialidad);
      }
    });
  }

  // Ejecutar cambio de estado 
  private ejecutarCambioEstado(especialidad: Especialidad): void {
    const nuevoEstado = !especialidad.estado;

    this.especialidadService.cambiarEstado(especialidad.id, nuevoEstado).subscribe({
      next: () => {
        this.loadEspecialidades();
      },
      error: () => {
        this.error.set('No se pudo cambiar el estado');
      },
    });
  }
}