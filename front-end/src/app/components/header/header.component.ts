import { Component } from '@angular/core';
import { HeaderServiceService } from '../../header-service.service';
import { DeleteConfirmDialogComponent } from 'src/app/share/delete-confirm-dialog/delete-confirm-dialog.component';
import { AuthService } from 'src/app/pages/auth/auth.service';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent {
  constructor(
    public headerService: HeaderServiceService,
    private authService: AuthService,
    public router: Router,
    public dialog: MatDialog,
  ) {
    this.headerService.setBackground('#0f212f');
  }
  user_info: any;
  loading = true;

  isadmin = false;
  ngOnInit() {
    this.router.events.subscribe((e) => {
      this.user_info = this.authService.getLoggedInUser();
    
    });
 
  }
  logout() {
    this.dialog
      .open(DeleteConfirmDialogComponent, {
        data: {
          title: 'Logout',
          message: 'Are you sure you want to logout?',
          svg: `../../assets/shared-image/logout.png`,
        },
      })
      .afterClosed()
      .subscribe((dialogResult: boolean) => {
        if (dialogResult) {
          localStorage.removeItem('access_token');
          this.user_info = null;
          this.router.navigate(['./']);
        }
      });
  }
  login() {
    if (this.user_info) this.logout();
    else {
      this.authService.goToLogin();
    }
  }
}
