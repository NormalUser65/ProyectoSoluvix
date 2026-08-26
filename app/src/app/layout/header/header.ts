import { Component, input, output } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';

import { Usuario } from '../../core/models/usuario.model';

interface MenuItem {
  label: string;
  path: string;
  icon: string;
  roles?: string[];
  children?: MenuItem[];
}

@Component({
  selector: 'app-header',
  standalone: true,

  imports: [
    RouterLink,
    RouterLinkActive,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatMenuModule
  ],

  templateUrl: './header.html',
  styleUrl: './header.css'
})
export class Header {
  usuario = input<Usuario | null>(null);
  rol = input<string | null>(null);
  autenticado = input(false);

  logoutUser = output<void>();

  readonly publicMenu: MenuItem[] = [
    {
      label: 'Servicios',
      path: '/servicios',
      icon: 'photo_camera'
    },
    {
      label: 'Profesionales',
      path: '/admin/profesionales',
      icon: 'person'
    }
  ];

  readonly adminMenu: MenuItem[] = [
  {
    label: 'Usuarios',
    path: '/usuarios',
    icon: 'group'
  },
  {
    label: 'Categorías',
    path: '/categorias',
    icon: 'category'
  },
  {
    label: 'Especialidades',
    path: '/especialidades',
    icon: 'school'
  },
  {
    label: 'Profesionales',
    path: '/admin/profesionales',
    icon: 'person'
  },
  {
    label: 'Servicios',
    path: '/admin/servicios',
    icon: 'photo_camera'
  },
  {
    label: 'Citas',
    path: '/citas',
    icon: 'event'
  },
  // 👇 NUEVO: Reportes
  {
    label: '📊 Reportes',
    path: '/reportes',
    icon: 'analytics',
    children: [
      {
        label: 'Citas por Estado',
        path: '/reportes/citas-estado',
        icon: 'pie_chart'
      },
      {
        label: 'Citas por Profesional',
        path: '/reportes/citas-profesional',
        icon: 'bar_chart'
      },
      {
        label: 'Calificaciones',
        path: '/reportes/calificaciones',
        icon: 'star'
      }
    ]
  }
];

  puedeMostrar(item: MenuItem): boolean {
    if (!item.roles?.length) {
      return true;
    }

    const rolActual = this.rol();

    return (
      rolActual !== null &&
      item.roles.includes(rolActual)
    );
  }
}