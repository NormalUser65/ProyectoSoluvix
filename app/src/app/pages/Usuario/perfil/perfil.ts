import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';

import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';

import { AuthService } from '../../../core/services/auth.service';

@Component({
    selector: 'app-perfil',
    imports: [
    RouterLink,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatDividerModule,
    ],
    templateUrl: './perfil.html',
    styleUrl: './perfil.css',
})
export class Perfil {
    private readonly authService = inject(AuthService);

    readonly usuario = this.authService.usuario;
    readonly rol = this.authService.rol;
}