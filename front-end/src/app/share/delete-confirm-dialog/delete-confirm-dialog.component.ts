import { Component, Inject, OnInit } from '@angular/core';
import {
  MAT_DIALOG_DATA,
  MatDialogModule,
  MatDialogRef,
} from '@angular/material/dialog';
import { HeaderServiceService } from '../../header-service.service';
import { CommonModule } from '@angular/common';
import { DialogLayoutComponent } from '../dialog-layout/dialog-layout.component';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { DialogModule } from '@angular/cdk/dialog';
import { DeleteDialogService } from './delete-dialog.service';

@Component({
  selector: 'app-delete-confirm-dialog',
  templateUrl: './delete-confirm-dialog.component.html',
  styleUrls: ['./delete-confirm-dialog.component.scss'],

})
export class DeleteConfirmDialogComponent implements OnInit {
  constructor(
    public dialogRef: MatDialogRef<DeleteConfirmDialogComponent>,
    public headerService: HeaderServiceService,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}
  ngOnInit() {}
}
