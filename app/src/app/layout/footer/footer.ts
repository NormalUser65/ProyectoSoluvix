import { Component, inject } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { TranslocoModule } from '@jsverse/transloco'; 

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [MatIconModule, TranslocoModule], 
  templateUrl: './footer.html',
  styleUrl: './footer.css',
})
export class Footer {
  year = new Date().getFullYear();
}