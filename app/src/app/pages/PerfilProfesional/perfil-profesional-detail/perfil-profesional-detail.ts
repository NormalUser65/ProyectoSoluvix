import { Component, inject, signal, computed } from '@angular/core'; 
import { ActivatedRoute, RouterLink } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

import { PerfilProfesionalService } from '../../../core/services/perfilProfesionalService';
import { ResenaService } from '../../../core/services/resena.service';
import { PerfilProfesional } from '../../../core/models/perfilProfesional.model';
import { Resena } from '../../../core/models/resena.model';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-perfil-profesional-detail',
  imports: [
    RouterLink,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    CommonModule,
  ],
  templateUrl: './perfil-profesional-detail.html',
  styleUrls: ['./perfil-profesional-detail.css'],
})
export class PerfilProfesionalDetail {
  private readonly perfilService = inject(PerfilProfesionalService);
  private readonly resenaService = inject(ResenaService); 
  private readonly route = inject(ActivatedRoute);

  perfil = signal<PerfilProfesional | null>(null);
  resenas = signal<Resena[]>([]); 
  loading = signal(false);
  loadingResenas = signal(false); 
  error = signal<string | null>(null);

  promedio = computed(() => {
    const lista = this.resenas();
    if (lista.length === 0) return 0;
    const total = lista.reduce((sum, r) => sum + r.puntuacion, 0);
    return Math.round((total / lista.length) * 10) / 10;
  });

  totalResenas = computed(() => this.resenas().length);

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    if (id) {
      this.loadPerfil(id);
      this.cargarResenas(id);
    }
  }

  loadPerfil(id: number): void {
    this.loading.set(true);
    this.error.set(null);

    this.perfilService.obtenerPorId(id).subscribe({
      next: (response) => {
        this.perfil.set(response.data);
        this.loading.set(false);
        console.log('Perfil cargado:', response.data);
      },
      error: () => {
        this.error.set('No se pudo cargar el perfil profesional.');
        this.loading.set(false);
      },
    });
  }

  cargarResenas(id: number): void {
    this.loadingResenas.set(true);
    this.resenaService.obtenerPorProfesional(id).subscribe({
      next: (response) => {
        this.resenas.set(response.data || []);
        this.loadingResenas.set(false);
      },
      error: (error) => {
        console.error('Error al cargar reseñas:', error);
        this.resenas.set([]);
        this.loadingResenas.set(false);
      },
    });
  }

  getImageUrl(imageName: string): string {
    return this.perfilService.getImageUrl(imageName);
  }
}