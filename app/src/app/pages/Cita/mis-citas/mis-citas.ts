import { Component, inject, signal } from '@angular/core';
import { DatePipe } from '@angular/common';
import { RouterLink } from '@angular/router';

import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';

import { CitaService } from '../../../core/services/Cita.Service';
import { Cita } from '../../../core/models/cita.model';

import { EstadoCitaService } from '../../../core/services/estadoCita.service';
import { EstadoCita } from '../../../core/models/estadoCita.model';

@Component({
    selector: 'app-mis-citas',
    imports: [
    RouterLink,
    DatePipe,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatFormFieldModule,
    MatSelectModule,
    MatInputModule,
    ],
    templateUrl: './mis-citas.html',
    styleUrl: './mis-citas.css',
})
export class MisCitas {
    private readonly citaService =
        inject(CitaService);

    private readonly estadoCitaService =
        inject(EstadoCitaService);

    citas = signal<Cita[]>([]);

    loading = signal(false);

    error = signal<string | null>(null);

    idEstado = signal<number | null>(null);

    fechaInicio = signal('');

    fechaFin = signal('');

    estados = signal<EstadoCita[]>([]);

    ngOnInit(): void {
        this.cargarEstados();
        this.cargarCitas();
    }

    cargarEstados(): void {
    this.estadoCitaService
        .listar()
        .subscribe({
        next: (response) => {
            this.estados.set(
            response.data ?? []
            );
        },

        error: (err) => {
            console.error(
            'Error al cargar estados:',
            err
            );
        },
        });
    }

    cargarCitas(): void {
        this.loading.set(true);

        this.error.set(null);

        this.citaService
        .misCitas(
            this.idEstado() ?? undefined,
            this.fechaInicio() || undefined,
            this.fechaFin() || undefined
        )
        .subscribe({
            next: (response) => {
            this.citas.set(
                response.data ?? []
            );

            this.loading.set(false);
            },

            error: (err) => {
            this.error.set(
                err?.error?.message ??
                'No se pudieron cargar sus citas'
            );

            this.loading.set(false);
            },
        });
    }

    limpiarFiltros(): void {
        this.idEstado.set(null);
        this.fechaInicio.set('');
        this.fechaFin.set('');

        this.cargarCitas();
    }
}