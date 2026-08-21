import { Component, inject, signal, computed } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';

import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

import { CategoriaService } from '../../../core/services/Categoria.Service';
import { Categoria } from '../../../core/models/categoria.model';

@Component({
  selector: 'app-categoria-list',
  imports: [
    FormsModule,
    RouterLink,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatFormFieldModule,
    MatInputModule,
  ],
  templateUrl: './categoria-list.html',
  styleUrls: ['./categoria-list.css'],
})
export class CategoriaList {
  private readonly categoriaService = inject(CategoriaService);

  categorias = signal<Categoria[]>([]);
  search = signal('');
  loading = signal(false);
  error = signal<string | null>(null);

  // Filtrar categorías según búsqueda
  categoriasFiltradas = computed(() => {
    const texto = this.search().trim().toLowerCase();
    return this.categorias().filter((cat) => {
      const nombre = cat.nombre?.toLowerCase() ?? '';
      const descripcion = cat.descripcion?.toLowerCase() ?? '';
      return (
        texto.length === 0 ||
        nombre.includes(texto) ||
        descripcion.includes(texto)
      );
    });
  });

  totalCategorias = computed(() => this.categoriasFiltradas().length);

  ngOnInit(): void {
    this.loadCategorias();
  }

  // Cargar categorías
  loadCategorias(): void {
    this.loading.set(true);
    this.error.set(null);

    this.categoriaService.listar().subscribe({
      next: (response) => {
        this.categorias.set(response.data);
        this.loading.set(false);
      },
      error: () => {
        this.error.set('No se pudieron cargar las categorías');
        this.loading.set(false);
      },
    });
  }

  // Limpiar filtros
  clearFilters(): void {
    this.search.set('');
  }

  // Cambiar estado
  toggleEstado(categoria: Categoria): void {
    const nuevoEstado = !categoria.estado;

    this.categoriaService.cambiarEstado(categoria.id, nuevoEstado).subscribe({
      next: () => {
        this.loadCategorias();
      },
      error: () => {
        this.error.set('No se pudo cambiar el estado');
      },
    });
  }
}
