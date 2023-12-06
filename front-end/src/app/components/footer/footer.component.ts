import { Component } from '@angular/core';
import { ContactUsDialogComponent } from './contact-us-dialog/contact-us-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { HeaderServiceService } from '../../header-service.service';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss'],
})
export class FooterComponent {
  constructor(
    private dialog: MatDialog,
    public headerService: HeaderServiceService
  ) {}

  openDialogContactUs() {
    this.dialog.open(ContactUsDialogComponent, {
      width: '100%',
      maxWidth: '650px',
    });
  }
}
