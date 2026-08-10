import { Component, inject, signal, computed } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';

import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';

import { ServicioService } from '../../../core/services/servicio.service';
import { Servicio } from '../../../core/models/servicio.model';
import { Categoria } from '../../../core/models/categoria.model';
import { CurrencyPipe } from '@angular/common';

@Component({
  selector: 'app-servicio-list',
  imports: [
    FormsModule,
    RouterLink,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    CurrencyPipe,
  ],
  templateUrl: './servicio-list.html',
  styleUrls: ['./servicio-list.css'],
})

export class ServicioList {
  private readonly servicioService = inject(ServicioService);

  servicios = signal<Servicio[]>([]);
  search = signal('');
  categoriaId = signal<number | null>(null);
  loading = signal(false);
  error = signal<string | null>(null);

  categorias = computed<Categoria[]>(() => {
    const map = new Map<number, Categoria>();
    this.servicios().forEach((srv) => {
      if (srv.categoria) {
        map.set(srv.categoria.id, srv.categoria);
      }
    });
    return Array.from(map.values());
  });

  serviciosFiltrados = computed(() => {
    const texto = this.search().trim().toLowerCase();
    const categoriaSeleccionada = this.categoriaId();
    return this.servicios().filter((srv) => {
      const nombre = srv.nombre?.toLowerCase() ?? '';
      const descripcion = srv.descripcion?.toLowerCase() ?? '';
      const categoriaNombre = srv.categoria?.nombre?.toLowerCase() ?? '';
      const coincideTexto =
        texto.length === 0 ||
        nombre.includes(texto) ||
        descripcion.includes(texto) ||
        categoriaNombre.includes(texto);
      const coincideCategoria =
        categoriaSeleccionada === null ||
        srv.idCategoria === categoriaSeleccionada ||
        srv.categoria?.id === categoriaSeleccionada;

      return coincideTexto && coincideCategoria;
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
        this.error.set('No se pudieron cargar los servicios.');
        this.loading.set(false);
      },
    });
  }

  clearFilters(): void {
    this.search.set('');
    this.categoriaId.set(null);
  }

  getImageUrl(imageName: string): string {
    return this.servicioService.getImageUrl(imageName);
  }
}