import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { toast, NgxSonnerToaster } from 'ngx-sonner';
import { TranslocoModule } from '@jsverse/transloco'; 

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, NgxSonnerToaster, TranslocoModule], 
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('Soluvix'); 
}