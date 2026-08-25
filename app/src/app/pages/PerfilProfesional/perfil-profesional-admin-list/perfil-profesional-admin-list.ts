import { Component, inject, signal, computed } from '@angular/core';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

import { PerfilProfesionalService } from '../../../core/services/perfilProfesionalService';
import { DialogService } from '../../../core/services/dialog.Service';
import { PerfilProfesional } from '../../../core/models/perfilProfesional.model';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-perfil-profesional-admin-list',
  imports: [
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatSnackBarModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatTooltipModule,
    MatProgressSpinnerModule,
    RouterLink,
    FormsModule,
  ],
  templateUrl: './perfil-profesional-admin-list.html',
  styleUrls: ['./perfil-profesional-admin-list.css'],
})
export class PerfilProfesionalAdminList {
  private readonly perfilService = inject(PerfilProfesionalService);
  private readonly snackBar = inject(MatSnackBar);
  private readonly dialogService = inject(DialogService);

  perfiles = signal<PerfilProfesional[]>([]);
  search = signal('');
  modalidadSeleccionada = signal<string | null>(null);
  disponibilidadSeleccionada = signal<boolean | null>(null);
  loading = signal(false);
  error = signal<string | null>(null);

  displayedColumns = ['nombre', 'titulo', 'modalidad', 'tarifa', 'disponible', 'acciones'];

  modalidades = computed(() => {
    const set = new Set<string>();
    this.perfiles().forEach((p) => {
      if (p.modalidad?.nombre) set.add(p.modalidad.nombre);
    });
    return Array.from(set.values());
  });

  perfilesFiltrados = computed(() => {
    const texto = this.search().trim().toLowerCase();
    const modalidadSel = this.modalidadSeleccionada();
    const disponibilidadSel = this.disponibilidadSeleccionada();

    return this.perfiles().filter((p) => {
      const nombreCompleto = `${p.usuario?.nombre ?? ''} ${p.usuario?.apellidos ?? ''}`.toLowerCase();
      const titulo = p.tituloProfesional?.toLowerCase() ?? '';
      const coincideTexto =
        texto.length === 0 ||
        nombreCompleto.includes(texto) ||
        titulo.includes(texto);

      const coincideModalidad =
        modalidadSel === null || p.modalidad?.nombre === modalidadSel;

      const coincideDisponibilidad =
        disponibilidadSel === null || p.disponible === disponibilidadSel;

      return coincideTexto && coincideModalidad && coincideDisponibilidad;
    });
  });

  totalPerfiles = computed(() => this.perfilesFiltrados().length);

  ngOnInit(): void {
    this.loadPerfiles();
  }

  loadPerfiles(): void {
    this.loading.set(true);
    this.error.set(null);

    this.perfilService.listar().subscribe({
      next: (response) => {
        this.perfiles.set(response.data);
        this.loading.set(false);
      },
      error: () => {
        this.error.set('No se pudieron cargar los perfiles profesionales.');
        this.loading.set(false);
        this.snackBar.open('Error al cargar profesionales', 'Cerrar', { duration: 3000 });
      },
    });
  }

  clearFilters(): void {
    this.search.set('');
    this.modalidadSeleccionada.set(null);
    this.disponibilidadSeleccionada.set(null);
  }

  getImageUrl(imageName: string): string {
    return this.perfilService.getImageUrl(imageName);
  }

  toggleDisponibilidad(perfil: PerfilProfesional): void {
    const accion = perfil.disponible ? 'desactivar' : 'activar';
    const mensaje = `¿Estás seguro de que deseas ${accion} el perfil de "${perfil.usuario?.nombre} ${perfil.usuario?.apellidos}"?`;
    const tipo = perfil.disponible ? 'peligro' : 'normal';
    
    this.dialogService.confirmar(mensaje, 'Confirmar acción', tipo).subscribe(confirmed => {
      if (confirmed) {
        this.ejecutarCambioDisponibilidad(perfil);
      }
    });
  }

private ejecutarCambioDisponibilidad(perfil: PerfilProfesional): void {
  const nuevoEstado = !perfil.disponible;

  const updateDto = {
    disponible: nuevoEstado
  };

  this.perfilService.actualizar(perfil.id, updateDto).subscribe({
    next: () => {
      this.loadPerfiles();
      this.snackBar.open(
        `Disponibilidad de ${perfil.usuario?.nombre} ${perfil.usuario?.apellidos} actualizada`,
        'Cerrar',
        { duration: 3000 }
      );
    },
    error: () => {
      this.error.set('No se pudo cambiar la disponibilidad');
      this.snackBar.open('Error al cambiar disponibilidad', 'Cerrar', { duration: 3000 });
    },
  });
}

  eliminar(perfil: PerfilProfesional): void {
    const mensaje = `¿Estás seguro de que deseas eliminar el perfil de "${perfil.usuario?.nombre} ${perfil.usuario?.apellidos}"?`;
    
    this.dialogService.confirmar(mensaje, 'Confirmar eliminación', 'peligro').subscribe(confirmed => {
      if (confirmed) {
        this.snackBar.open(
          `Eliminar perfil de ${perfil.usuario?.nombre} - Función no implementada`,
          'Cerrar',
          { duration: 3000 }
        );

      }
    });
  }
}