import { Component, inject, signal, computed } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';

import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';

import { UsuarioService } from '../../../core/services/usuario.service';
import { Usuario } from '../../../core/models/usuario.model';

import { TranslocoModule } from '@jsverse/transloco'; 

@Component({
  selector: 'app-usuario-list',
  imports: [
    FormsModule,
    RouterLink,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    TranslocoModule 
  ],
  templateUrl: './usuario-list.html',
  styleUrls: ['./usuario-list.css'],
})
export class UsuarioList {
  private readonly usuarioService = inject(UsuarioService);

  usuarios = signal<Usuario[]>([]);
  search = signal('');
  rolSeleccionado = signal<string | null>(null);
  loading = signal(false);
  error = signal<string | null>(null);

  roles = computed(() => {
    const map = new Map<number, string>();
    this.usuarios().forEach((usr) => {
      if (usr.rol) {
        map.set(usr.rol.id, usr.rol.nombre);
      }
    });
    return Array.from(map.entries()).map(([id, nombre]) => ({ id, nombre }));
  });

  usuariosFiltrados = computed(() => {
    const texto = this.search().trim().toLowerCase();
    const rolSel = this.rolSeleccionado();
    return this.usuarios().filter((usr) => {
      const nombre = usr.nombre?.toLowerCase() ?? '';
      const apellidos = usr.apellidos?.toLowerCase() ?? '';
      const correo = usr.correo?.toLowerCase() ?? '';
      const rolNombre = usr.rol?.nombre?.toLowerCase() ?? '';

      const coincideTexto =
        texto.length === 0 ||
        nombre.includes(texto) ||
        apellidos.includes(texto) ||
        correo.includes(texto) ||
        rolNombre.includes(texto);

      const coincideRol = rolSel === null || usr.rol?.nombre === rolSel;

      return coincideTexto && coincideRol;
    });
  });

  totalUsuarios = computed(() => this.usuariosFiltrados().length);

  ngOnInit(): void {
    this.loadUsuarios();
  }

  loadUsuarios(): void {
    this.loading.set(true);
    this.error.set(null);

    this.usuarioService.listar().subscribe({
      next: (response) => {
        this.usuarios.set(response.data);
        this.loading.set(false);
        console.log('Usuarios cargados:', response.data);
      },
      error: () => {
        this.error.set('No se pudieron cargar los usuarios.');
        this.loading.set(false);
      },
    });
  }

  clearFilters(): void {
    this.search.set('');
    this.rolSeleccionado.set(null);
  }
}