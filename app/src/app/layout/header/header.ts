import { Component, input, output, inject } from '@angular/core'; 
import { RouterLink, RouterLinkActive } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatBadgeModule } from '@angular/material/badge';
import { TranslocoModule, TranslocoService } from '@jsverse/transloco'; 

type Role = 'CLIENTE' | 'ADMIN';

interface MenuItem {
  label: string;
  path: string;
  icon: string;
  roles?: Role[];
}

interface User {
  nombre: string;
  role: Role;
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
    MatMenuModule,
    MatBadgeModule,
    TranslocoModule 
  ],
  templateUrl: './header.html',
  styleUrl: './header.css'
})
export class Header {
  private translocoService = inject(TranslocoService); 

  publicMenu = input.required<MenuItem[]>();
  adminMaintenanceMenu = input.required<MenuItem[]>();
  adminManagementMenu = input.required<MenuItem[]>();
  currentUser = input<User | null>(null);
  cartCount = input(0);
  isAdmin = input(false);
  canShowItem = input.required<(item: MenuItem) => boolean>();

  loginClient = output<void>();
  loginAdmin = output<void>();
  logoutUser = output<void>();

  readonly listadosMenu: MenuItem[] = [
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
      icon: 'event'
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
    }
  ];

  // Cambiar idioma
  changeLang(lang: string) {
    console.log('Cambiando idioma a:', lang);
    this.translocoService.setActiveLang(lang);
    localStorage.setItem('lang', lang);
    console.log('Idioma actual:', this.translocoService.getActiveLang());
  }
}