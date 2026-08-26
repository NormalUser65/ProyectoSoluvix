import { Component, computed, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';

import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

import { Servicio } from '../../../core/models/servicio.model';
import { ServicioService } from '../../../core/services/servicio.service';
import { PerfilProfesional } from '../../../core/models/perfilProfesional.model';
import { AuthService } from '../../../core/services/auth.service';
import { PerfilProfesionalService } from '../../../core/services/perfilProfesionalService';
import { DialogService } from '../../../core/services/dialog.Service';
import { CurrencyPipe } from '@angular/common';
import { ApiResponse, ApiPaginatedResponse } from '../../../core/models/apiResponse.model'; // 👈 NUEVO

@Component({
  selector: 'app-servicio-admin-list',
  imports: [
    RouterLink,
    FormsModule,
    MatButtonModule,
    MatIconModule,
    MatTableModule,
    MatProgressSpinnerModule,
    MatFormFieldModule,
    MatInputModule,
    MatSnackBarModule,
    CurrencyPipe,
  ],
  templateUrl: './servicio-admin-list.html',
  styleUrls: ['./servicio-admin-list.css'],
})
export class ServicioAdminList {
  private readonly servicioService = inject(ServicioService);
  private readonly authService = inject(AuthService);
  private readonly perfilService = inject(PerfilProfesionalService);
  private readonly dialogService = inject(DialogService);
  private readonly snackBar = inject(MatSnackBar);

  servicios = signal<Servicio[]>([]);
  search = signal('');
  loading = signal(false);
  error = signal<string | null>(null);
  perfilProfesionalId = signal<number | null>(null);

  displayedColumns = [
    'nombre',
    'categoria',
    'precio',
    'duracion',
    'profesional',
    'modalidad',
    'estado',
    'acciones',
  ];

  esProfesional = computed(() => this.authService.rol() === 'PROFESIONAL');

  serviciosFiltrados = computed(() => {
    const texto = this.search().trim().toLowerCase();
    if (!texto) {
      return this.servicios();
    }
    return this.servicios().filter((srv) => {
      const nombre = srv.nombre?.toLowerCase() ?? '';
      const descripcion = srv.descripcion?.toLowerCase() ?? '';
      const categoria = srv.categoria?.nombre?.toLowerCase() ?? '';

      return nombre.includes(texto) || descripcion.includes(texto) || categoria.includes(texto);
    });
  });

  totalServicios = computed(() => this.serviciosFiltrados().length);

  ngOnInit(): void {
    this.loadServicios();
  }

  loadServicios(): void {
    this.loading.set(true);
    this.error.set(null);

    if (this.esProfesional()) {
      const usuario = this.authService.usuario();
      if (!usuario) {
        this.error.set('Usuario no autenticado.');
        this.loading.set(false);
        return;
      }

      // 👈 Usar listar() en lugar de obtenerPorUsuario
      this.perfilService.listar().subscribe({
        next: (response: ApiPaginatedResponse<PerfilProfesional>) => {
          const perfil = response.data.find(p => p.idUsuario === usuario.id);
          if (!perfil) {
            this.error.set('No tienes un perfil profesional asociado.');
            this.loading.set(false);
            return;
          }
          this.perfilProfesionalId.set(perfil.id);
          this.cargarServicios(perfil.id);
        },
        error: () => {
          this.error.set('No se pudo obtener tu perfil profesional.');
          this.loading.set(false);
        },
      });
    } else {
      this.cargarServicios(null);
    }
  }

  private cargarServicios(idPerfil: number | null): void {
    if (idPerfil) {
      this.servicioService.listarPorProfesional(idPerfil).subscribe({
        next: (response: ApiPaginatedResponse<Servicio>) => {
          this.servicios.set(response.data);
          this.loading.set(false);
        },
        error: () => {
          this.error.set('No se pudieron cargar tus servicios.');
          this.loading.set(false);
        },
      });
    } else {
      this.servicioService.listar().subscribe({
        next: (response: ApiPaginatedResponse<Servicio>) => {
          this.servicios.set(response.data);
          this.loading.set(false);
        },
        error: () => {
          this.error.set('No se pudo cargar el mantenimiento de servicios.');
          this.loading.set(false);
        },
      });
    }
  }

  toggleEstado(servicio: Servicio): void {
    const accion = servicio.estado ? 'desactivar' : 'activar';
    const mensaje = `¿Estás seguro de que deseas ${accion} el servicio "${servicio.nombre}"?`;
    const tipo = servicio.estado ? 'peligro' : 'normal';

    this.dialogService.confirmar(mensaje, 'Confirmar acción', tipo).subscribe((confirmed) => {
      if (confirmed) {
        this.ejecutarCambioEstado(servicio);
      }
    });
  }

  private ejecutarCambioEstado(servicio: Servicio): void {
    const nuevoEstado = !servicio.estado;

    this.servicioService.cambiarEstado(servicio.id, nuevoEstado).subscribe({
      next: () => {
        this.loadServicios();
        this.snackBar.open(
          `Servicio ${servicio.estado ? 'desactivado' : 'activado'} correctamente`,
          'Cerrar',
          { duration: 3000 },
        );
      },
      error: () => {
        this.error.set('No se pudo cambiar el estado del servicio');
        this.snackBar.open('Error al cambiar el estado', 'Cerrar', { duration: 3000 });
      },
    });
  }

  puedeEditar(servicio: Servicio): boolean {
    if (!this.esProfesional()) return true;
    const usuario = this.authService.usuario();
    return servicio.perfil?.idUsuario === usuario?.id;
  }

  clearSearch(): void {
    this.search.set('');
  }
}