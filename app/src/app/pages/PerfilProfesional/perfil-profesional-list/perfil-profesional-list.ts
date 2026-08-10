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

import { PerfilProfesionalService } from '../../../core/services/perfilProfesionalService';
import { PerfilProfesional } from '../../../core/models/perfilProfesional.model';

@Component({
  selector: 'app-perfil-profesional-list',
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
  ],
  templateUrl: './perfil-profesional-list.html',
  styleUrls: ['./perfil-profesional-list.css'],
})
export class PerfilProfesionalList {
  private readonly perfilService = inject(PerfilProfesionalService);

  perfiles = signal<PerfilProfesional[]>([]);
  search = signal('');
  modalidadSeleccionada = signal<string | null>(null);
  disponibilidadSeleccionada = signal<boolean | null>(null);
  loading = signal(false);
  error = signal<string | null>(null);

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
      const nombreCompleto = `${p.usuario.nombre} ${p.usuario.apellidos}`.toLowerCase();
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
        console.log('Perfiles cargados:', response.data);
      },
      error: () => {
        this.error.set('No se pudieron cargar los perfiles profesionales.');
        this.loading.set(false);
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
}