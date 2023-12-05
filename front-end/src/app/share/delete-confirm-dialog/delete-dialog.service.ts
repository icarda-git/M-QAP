import { Injectable } from '@angular/core';
import { DeleteConfirmDialogComponent } from './delete-confirm-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { Observable } from 'rxjs';

@Injectable()
export class DeleteDialogService {
  constructor(public dialog: MatDialog) {}

  create(
    data: { message: string; title: string } = {
      message: 'Are you sure you want to delete this record ?',
      title: 'Delete',
    }
  ): Observable<boolean> {
    return this.dialog
      .open(DeleteConfirmDialogComponent, {
        width: '100%',
        maxWidth: '650px',
        data,
      })
      .afterClosed();
  }
}
