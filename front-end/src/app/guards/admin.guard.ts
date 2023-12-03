import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  Router,
  RouterStateSnapshot,
  UrlTree,
} from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../pages/auth/auth.service';

@Injectable({
  providedIn: 'root',
})
export class AdminGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

  async canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    const user = await this.authService.getLoggedInUser();
    if (!user) {
      this.authService.goToLogin()
      return false;
    } else {
      if (user.role == 'admin') {
        return true;
      } else {
        this.authService.goToLogin()
        return false;
      }
    }
  }
}
