import { Component, inject, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import {
    email,
    form,
    FormField,
    minLength,
    required
} from '@angular/forms/signals';
import { finalize } from 'rxjs';

import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

import { AuthService } from '../../../core/services/auth.service';
import { EditarPerfilFormModel, UpdatePerfilRequest } from '../../../core/models/usuario.model';

@Component({
    selector: 'app-editar-perfil',
    imports: [
    RouterLink,
    FormField,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    ],
    templateUrl: './editarPerfil.html',
    styleUrl: './editarPerfil.css',
})
export class EditarPerfil {
    private readonly authService = inject(AuthService);
    private readonly router = inject(Router);

    readonly submitted = signal(false);
    readonly enviando = signal(false);
    readonly ocultarPassword = signal(true);
    readonly errorServidor = signal<string | null>(null);

    private readonly usuarioActual =
        this.authService.usuario();

    readonly model = signal<EditarPerfilFormModel>({
    nombre: this.usuarioActual?.nombre ?? '',
    apellidos: this.usuarioActual?.apellidos ?? '',
    correo: this.usuarioActual?.correo ?? '',
    telefono: this.usuarioActual?.telefono ?? '',
    contrasenna: '',
    });

    readonly perfilForm = form(this.model, (path) => {

        required(path.nombre, {
        message: 'El nombre es obligatorio.'
        });

        minLength(path.nombre, 2, {
        message: 'El nombre debe tener al menos 2 caracteres.'
        });

        required(path.apellidos, {
        message: 'Los apellidos son obligatorios.'
        });

        minLength(path.apellidos, 2, {
        message: 'Los apellidos deben tener al menos 2 caracteres.'
        });

        required(path.correo, {
        message: 'El correo es obligatorio.'
        });

        email(path.correo, {
        message: 'Ingrese un correo válido.'
        });

        required(path.telefono, {
        message: 'El teléfono es obligatorio.'
        });

    });

    submit(): void {
        this.submitted.set(true);

        if (this.perfilForm().invalid()) {
        return;
        }

        const model = this.model();

        const datos: UpdatePerfilRequest = {
        nombre: model.nombre,
        apellidos: model.apellidos,
        correo: model.correo,
        telefono: model.telefono,
        };

        if (model.contrasenna.trim()) {
        if (model.contrasenna.length < 6) {
            this.errorServidor.set(
            'La nueva contraseña debe tener al menos 6 caracteres.'
            );
            return;
        }

        datos.contrasenna = model.contrasenna;
        }

        if (model.contrasenna?.trim()) {

        if (model.contrasenna.length < 6) {
            this.errorServidor.set(
            'La nueva contraseña debe tener al menos 6 caracteres.'
            );
            return;
        }

        datos.contrasenna =
            model.contrasenna;
        }

        this.enviando.set(true);
        this.errorServidor.set(null);

        this.authService
        .actualizarPerfil(datos)
        .pipe(
            finalize(() =>
            this.enviando.set(false)
            )
        )
        .subscribe({
            next: () => {
            void this.router.navigate([
                '/perfil'
            ]);
            },

            error: (error) => {
            this.errorServidor.set(
                error?.error?.message ??
                'No fue posible actualizar el perfil.'
            );
            },
        });
    }
}