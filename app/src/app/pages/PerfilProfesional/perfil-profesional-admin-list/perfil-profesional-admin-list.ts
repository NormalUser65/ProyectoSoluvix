import { Component, inject, signal } from '@angular/core';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

import { PerfilProfesionalService } from '../../../core/services/perfilProfesionalService';
import { PerfilProfesional } from '../../../core/models/perfilProfesional.model';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-perfil-profesional-admin-list',
  imports: [
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatSlideToggleModule,
    MatSnackBarModule,
    RouterLink,
  ],
  templateUrl: './perfil-profesional-admin-list.html',
  styleUrls: ['./perfil-profesional-admin-list.css'],
})
export class PerfilProfesionalAdminList {
  private readonly perfilService = inject(PerfilProfesionalService);
  private readonly snackBar = inject(MatSnackBar);

  perfiles = signal<PerfilProfesional[]>([]);
  displayedColumns = ['nombre', 'titulo', 'modalidad', 'tarifa', 'disponible', 'acciones'];

  ngOnInit(): void {
    this.loadPerfiles();
  }

  loadPerfiles(): void {
    this.perfilService.listar().subscribe({
      next: (response) => {
        this.perfiles.set(response.data);
      },
      error: () => {
        this.snackBar.open('Error al cargar profesionales', 'Cerrar', { duration: 3000 });
      },
    });
  }

  toggleDisponibilidad(perfil: PerfilProfesional): void {
    perfil.disponible = !perfil.disponible;
    this.snackBar.open(
      `Disponibilidad de ${perfil.usuario.nombre} ${perfil.usuario.apellidos} actualizada`,
      'Cerrar',
      { duration: 3000 }
    );
  }

  editar(perfil: PerfilProfesional): void {
    this.snackBar.open(`Editar perfil de ${perfil.usuario.nombre}`, 'Cerrar', { duration: 3000 });
  }

  eliminar(perfil: PerfilProfesional): void {
    this.snackBar.open(`Eliminar perfil de ${perfil.usuario.nombre}`, 'Cerrar', { duration: 3000 });
  }
}