import { Component, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { TranslocoModule, TranslocoService } from '@jsverse/transloco';

import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTooltipModule } from '@angular/material/tooltip';

import { EspecialidadService } from '../../../core/services/especialidad.service';
import { Especialidad } from '../../../core/models/especialidad.model';

@Component({
  selector: 'app-especialidad-list',
  imports: [
    RouterLink,
    FormsModule,
    TranslocoModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatTooltipModule,
  ],
  templateUrl: './especialidad-list.html',
  styleUrls: ['./especialidad-list.css'],
})
export class EspecialidadList {
  private readonly especialidadService = inject(EspecialidadService);
  private readonly translocoService = inject(TranslocoService);

  especialidades = signal<Especialidad[]>([]);
  loading = signal(false);
  error = signal<string | null>(null);

  ngOnInit(): void {
    this.loadEspecialidades();
  }

  loadEspecialidades(): void {
    this.loading.set(true);
    this.error.set(null);

    this.especialidadService.listar().subscribe({
      next: (response) => {
        this.especialidades.set(response.data);
        this.loading.set(false);
      },
      error: () => {
        this.error.set(this.translocoService.translate('error_carga'));
        this.loading.set(false);
      },
    });
  }

  toggleEstado(especialidad: Especialidad): void {
    const nuevoEstado = !especialidad.estado;

    this.especialidadService.cambiarEstado(especialidad.id, nuevoEstado).subscribe({
      next: () => {
        this.loadEspecialidades();
      },
      error: () => {
        this.error.set(this.translocoService.translate('error_estado'));
      },
    });
  }
}