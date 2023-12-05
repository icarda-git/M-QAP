import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DialogModule } from '@angular/cdk/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { DialogLayoutComponent } from '../dialog-layout/dialog-layout.component';
import { DeleteDialogService } from './delete-dialog.service';
import { DeleteConfirmDialogComponent } from './delete-confirm-dialog.component';

@NgModule({
  declarations: [DeleteConfirmDialogComponent],
  imports: [
    CommonModule,
    MatDialogModule,
    DialogLayoutComponent,
    MatIconModule,
    MatButtonModule,
    DialogModule,
  ],
  providers: [DeleteDialogService],
})
export class DeleteConfirmDialogModule {}
