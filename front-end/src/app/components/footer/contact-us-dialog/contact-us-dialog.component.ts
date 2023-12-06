import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-contact-us-dialog',
  templateUrl: './contact-us-dialog.component.html',
  styleUrls: ['./contact-us-dialog.component.scss'],
})
export class ContactUsDialogComponent {
  constructor(public dialogRef: MatDialogRef<ContactUsDialogComponent>) {}

}
