import { Component, inject, signal } from '@angular/core';
import { DatePipe } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';

import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

import { CitaService } from '../../../core/services/Cita.Service';
import { Cita } from '../../../core/models/cita.model';

@Component({
    selector: 'app-mi-cita-detail',
    standalone: true,

    imports: [
    DatePipe,
    RouterLink,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    ],

    templateUrl: './mi-cita-detail.html',
    styleUrl: './mi-cita-detail.css',
})
export class MiCitaDetail {
    private readonly route =
        inject(ActivatedRoute);

    private readonly citaService =
        inject(CitaService);

    cita = signal<Cita | null>(null);

    loading = signal(true);

    error = signal<string | null>(null);

    constructor() {
        this.cargarCita();
    }

    cargarCita(): void {
    const id = Number(
        this.route.snapshot.paramMap.get('id')
    );

    if (!id) {
        this.error.set(
            'La cita indicada no es válida'
        );

        this.loading.set(false);

        return;
    }

    this.citaService
        .obtenerMiCitaPorId(id)
        .subscribe({
            next: (response) => {
            this.cita.set(
                response.data ?? null
            );

            this.loading.set(false);
            },

            error: (err) => {
            this.error.set(
                err?.error?.message ??
                'No se pudo cargar la cita'
            );

            this.loading.set(false);
            },
        });
    }
}