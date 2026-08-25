import { Injectable, inject } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Observable } from 'rxjs';
import { ConfirmDialogComponent, ConfirmDialogData } from '../../../app/shared/components/confirm-dialog/confirm-dialog';

@Injectable({
  providedIn: 'root'
})
export class DialogService {
  private readonly dialog = inject(MatDialog);

  confirmar(
    mensaje: string, 
    titulo: string = 'Confirmar', 
    tipo: 'peligro' | 'normal' = 'normal'
  ): Observable<boolean> {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      panelClass: 'custom-dialog-panel',
      data: { 
        titulo, 
        mensaje,
        tipo 
      } as ConfirmDialogData
    });
    return dialogRef.afterClosed();
  }
}