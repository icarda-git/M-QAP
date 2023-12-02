import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { HeaderServiceService } from '../../header-service.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-delete-confirm-dialog',
  templateUrl: './delete-confirm-dialog.component.html',
  styleUrls: ['./delete-confirm-dialog.component.scss'],
  standalone: true,
  imports: [CommonModule, MatDialogModule],
})
export class DeleteConfirmDialogComponent implements OnInit {
  constructor(
    public headerService: HeaderServiceService,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}
  ngOnInit() {}
}
