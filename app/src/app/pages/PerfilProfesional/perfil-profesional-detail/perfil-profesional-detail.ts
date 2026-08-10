import { Component, inject, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { TranslocoModule, TranslocoService } from '@jsverse/transloco';

import { PerfilProfesionalService } from '../../../core/services/perfilProfesionalService';
import { PerfilProfesional } from '../../../core/models/perfilProfesional.model';
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
    TranslocoModule,
  ],
  templateUrl: './perfil-profesional-detail.html',
  styleUrls: ['./perfil-profesional-detail.css'],
})
export class PerfilProfesionalDetail {
  private readonly perfilService = inject(PerfilProfesionalService);
  private readonly route = inject(ActivatedRoute);
  private readonly translocoService = inject(TranslocoService);

  perfil = signal<PerfilProfesional | null>(null);
  loading = signal(false);
  error = signal<string | null>(null);

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    if (id) {
      this.loadPerfil(id);
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
        this.error.set(this.translocoService.translate('error_carga_perfil'));
        this.loading.set(false);
      },
    });
  }

  getImageUrl(imageName: string): string {
    return this.perfilService.getImageUrl(imageName);
  }
}