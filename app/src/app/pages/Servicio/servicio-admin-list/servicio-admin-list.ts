import { Component, computed, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';

import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

import { Servicio } from '../../../core/models/servicio.model';
import { ServicioService } from '../../../core/services/servicio.service';
import { CurrencyPipe } from '@angular/common';

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
    CurrencyPipe,
  ],
  templateUrl: './servicio-admin-list.html',
  styleUrls: ['./servicio-admin-list.css'],
})
export class ServicioAdminList {
  private readonly servicioService = inject(ServicioService);

  servicios = signal<Servicio[]>([]);
  search = signal('');
  loading = signal(false);
  error = signal<string | null>(null);

  displayedColumns = ['nombre', 'categoria', 'precio', 'duracion', 
    'profesional', 'modalidad', 'estado', 'acciones'];


  serviciosFiltrados = computed(() => {
    const texto = this.search().trim().toLowerCase();
    if (!texto) {
      return this.servicios();
    }
    return this.servicios().filter((srv) => {
      const nombre = srv.nombre?.toLowerCase() ?? '';
      const descripcion = srv.descripcion?.toLowerCase() ?? '';
      const categoria = srv.categoria?.nombre?.toLowerCase() ?? '';

      return (
        nombre.includes(texto) ||
        descripcion.includes(texto) ||
        categoria.includes(texto)
      );
    });
  });

  totalServicios = computed(() => this.serviciosFiltrados().length);

  ngOnInit(): void {
    this.loadServicios();
  }

  loadServicios(): void {
    this.loading.set(true);
    this.error.set(null);
    this.servicioService.listar().subscribe({
      next: (response) => {
        this.servicios.set(response.data);
        this.loading.set(false);
        console.log('Servicios cargados:', response.data);
      },
      error: () => {
        this.error.set('No se pudo cargar el mantenimiento de servicios.');
        this.loading.set(false);
      },
    });
  }

  clearSearch(): void {
    this.search.set('');
  }
}