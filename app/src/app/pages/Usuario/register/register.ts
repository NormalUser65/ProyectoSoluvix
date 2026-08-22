import { Component, inject, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { form, FormField, required, email, minLength } from '@angular/forms/signals';
import { finalize } from 'rxjs';

import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

import { AuthService } from '../../../core/services/auth.service';
import { RolService } from '../../../core/services/rol.service';
import { RegisterRequest } from '../../../core/models/usuario.model';

@Component({
    selector: 'app-register',
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
    templateUrl: './register.html',
    styleUrl: './register.css',
})
export class Register {
    private readonly authService = inject(AuthService);
    private readonly router = inject(Router);
    private readonly rolService = inject(RolService);

    readonly submitted = signal(false);
    readonly ocultarPassword = signal(true);
    readonly enviando = signal(false);
    readonly errorServidor = signal<string | null>(null);

    // Guarda el ID real del rol CLIENTE
    readonly idRolCliente = signal<number | null>(null);

    readonly model = signal<RegisterRequest>({
        nombre: '',
        apellidos: '',
        correo: '',
        contrasenna: '',
        telefono: '',
        idRol: 0,
    });

    readonly registerForm = form(this.model, (path) => {
        required(path.nombre, { message: 'El nombre es obligatorio.' });
        minLength(path.nombre, 2, {
        message: 'El nombre debe tener al menos 2 caracteres.',
        });

        required(path.apellidos, { message: 'Los apellidos son obligatorios.' });
        minLength(path.apellidos, 2, {
        message: 'Los apellidos deben tener al menos 2 caracteres.',
        });

        required(path.correo, { message: 'El correo es obligatorio.' });
        email(path.correo, { message: 'Ingrese un correo válido.' });

        required(path.contrasenna, { message: 'La contraseña es obligatoria.' });
        minLength(path.contrasenna, 6, {
        message: 'La contraseña debe tener al menos 6 caracteres.',
        });
    });

    constructor() {
        this.rolService.listar()
        .subscribe({
            next: (roles) => {
            const rolCliente = roles.find(
                (rol) => rol.nombre.toUpperCase() === 'CLIENTE'
            );

            if (rolCliente) {
                this.idRolCliente.set(rolCliente.id);

                this.model.update((model) => ({
                ...model,
                idRol: rolCliente.id,
                }));
            }
            },
            error: () => {
            this.errorServidor.set(
                'No fue posible cargar el rol de cliente.'
            );
            },
        });
    }

    submit(): void {
        this.submitted.set(true);

        if (this.registerForm().invalid()) {
        return;
        }

        if (this.idRolCliente() === null) {
        this.errorServidor.set(
            'No fue posible identificar el rol de cliente.'
        );
        return;
        }

        this.enviando.set(true);
        this.errorServidor.set(null);

        this.authService.registrar(this.model())
        .pipe(finalize(() => this.enviando.set(false)))
        .subscribe({
            next: () => {
            void this.router.navigate(['/login']);
            },
            error: (error) => {
            this.errorServidor.set(
                error instanceof Error
                ? error.message
                : 'No fue posible crear la cuenta.'
            );
            },
        });
    }
}