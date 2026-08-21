import { Component, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';

import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

import { CitaService } from '../../../core/services/Cita.Service';
import { Cita } from '../../../core/models/cita.model';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-cita-list',
  imports: [
    RouterLink,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    DatePipe,
  ],
  templateUrl: './cita-list.html',
  styleUrls: ['./cita-list.css'],
})
export class CitaList {
  private readonly citaService =
    inject(CitaService);


  citas =
    signal<Cita[]>([]);

  loading =
    signal(false);

  error =
    signal<string | null>(null);


  ngOnInit(): void {
    this.loadCitas();
  }


  loadCitas(): void {

    this.loading.set(true);

    this.error.set(null);


    this.citaService
      .listar()
      .subscribe({

        next: (response) => {

          this.citas.set(
            response.data
          );

          this.loading.set(false);

        },

        error: () => {

          this.error.set(
            'No se pudieron cargar las citas'
          );

          this.loading.set(false);

        }

      });

  }
}