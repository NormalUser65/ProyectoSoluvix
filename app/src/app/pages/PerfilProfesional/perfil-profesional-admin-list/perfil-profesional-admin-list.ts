import { Component, inject, signal } from '@angular/core';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { RouterLink } from '@angular/router';
import { TranslocoModule, TranslocoService } from '@jsverse/transloco';

import { PerfilProfesionalService } from '../../../core/services/perfilProfesionalService';
import { PerfilProfesional } from '../../../core/models/perfilProfesional.model';

@Component({
  selector: 'app-perfil-profesional-admin-list',
  imports: [
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatSlideToggleModule,
    MatSnackBarModule,
    MatTooltipModule,
    RouterLink,
    TranslocoModule,
  ],
  templateUrl: './perfil-profesional-admin-list.html',
  styleUrls: ['./perfil-profesional-admin-list.css'],
})
export class PerfilProfesionalAdminList {
  private readonly perfilService = inject(PerfilProfesionalService);
  private readonly snackBar = inject(MatSnackBar);
  private readonly translocoService = inject(TranslocoService);

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
        this.snackBar.open(
          this.translocoService.translate('error_carga'),
          this.translocoService.translate('cerrar'),
          { duration: 3000 }
        );
      },
    });
  }

  toggleDisponibilidad(perfil: PerfilProfesional): void {
    perfil.disponible = !perfil.disponible;
    this.snackBar.open(
      this.translocoService.translate('disponibilidad_actualizada', {
        nombre: `${perfil.usuario.nombre} ${perfil.usuario.apellidos}`
      }),
      this.translocoService.translate('cerrar'),
      { duration: 3000 }
    );
  }

  editar(perfil: PerfilProfesional): void {
    this.snackBar.open(
      this.translocoService.translate('editando_perfil', {
        nombre: perfil.usuario.nombre
      }),
      this.translocoService.translate('cerrar'),
      { duration: 3000 }
    );
  }

  eliminar(perfil: PerfilProfesional): void {
    this.snackBar.open(
      this.translocoService.translate('eliminando_perfil', {
        nombre: perfil.usuario.nombre
      }),
      this.translocoService.translate('cerrar'),
      { duration: 3000 }
    );
  }
}