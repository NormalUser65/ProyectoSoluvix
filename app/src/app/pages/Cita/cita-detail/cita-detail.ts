import { Component, inject, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';

import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

import { CitaService } from '../../../core/services/Cita.Service';
import { Cita } from '../../../core/models/cita.model';
import { MatChipsModule } from '@angular/material/chips';
import { DatePipe } from '@angular/common';
import { TranslocoModule } from '@jsverse/transloco';


@Component({
  selector: 'app-servicio-detail',
  imports: [
    MatButtonModule,
    MatCardModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatChipsModule,
    DatePipe,
    RouterLink,
    TranslocoModule
  ],
  templateUrl: './cita-detail.html',
  styleUrls: ['./cita-detail.css'],
})
export class CitaDetail {
  private readonly route = inject(ActivatedRoute);
  private readonly citaService = inject(CitaService);

  cita = signal<Cita | null>(null);

loading = signal(false);

error = signal<string | null>(null);

ngOnInit(): void {

  const id = Number(
    this.route.snapshot.paramMap.get('id')
  );

  if (!id) {
    this.error.set('ID inválido');
    return;
  }

  this.loadCita(id);
}

loadCita(id: number): void {

  this.loading.set(true);
  this.error.set(null);

  this.citaService.obtenerPorId(id).subscribe({

    next: (response) => {
      this.cita.set(response.data);
      this.loading.set(false);
    },

    error: () => {
      this.error.set('No se pudo cargar la cita');
      this.loading.set(false);
    }

  });

}
}