import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';

import { Header } from '../header/header';
import { Footer } from '../footer/footer';

import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-main-layout',
  standalone: true,
  imports: [
    RouterOutlet,
    Header,
    Footer
  ],
  templateUrl: './main-layout.html',
  styleUrl: './main-layout.css',
})
export class MainLayout {
  private readonly authService = inject(AuthService);

  readonly usuario = this.authService.usuario;
  readonly rol = this.authService.rol;
  readonly esAdmin = this.authService.esAdmin;
  readonly autenticado = this.authService.autenticado;

  logout(): void {
    this.authService.logout();
  }
}
