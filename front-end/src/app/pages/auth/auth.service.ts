import { DOCUMENT } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { jwtDecode } from 'jwt-decode';
import { firstValueFrom } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { User } from 'src/app/share/types/user.model.type';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(
    private http: HttpClient,
    @Inject(DOCUMENT) private document: Document,
    private router: Router
  ) {}

  async logIntoAWS(code: string, redirect_url?: string) {
    let { access_token, expires_in } = await firstValueFrom(
      this.http.post(environment.api_url + '/auth/aws', { code }).pipe(
        map((d: any) => d),
        catchError((e) => {
          this.goToLogin(redirect_url, 'AWS');
          return e;
        })
      )
    );
    if (access_token) {
      localStorage.setItem('access_token', access_token);
      localStorage.setItem('access_expires_in', expires_in);
      if (redirect_url) this.router.navigateByUrl(redirect_url);
      else this.router.navigateByUrl('/');
    }
  }
  getLoggedInUser(): User | null {
    if (localStorage.getItem('access_token') as string)
      return jwtDecode(localStorage.getItem('access_token') as string);
    else return null;
  }
  goToLogin(redirect_url: string = '', type?: string) {
    this.document.location.href =
      environment.aws_cognito_link +
      `/login?client_id=${
        environment.aws_cognito_client_id
      }&response_type=code&scope=email+openid+phone+profile&redirect_uri=${
        environment.aws_cognito_client_redirect_uri
      }${redirect_url ? '?redirect_url=' + redirect_url : ''}`;
  }

  isAdmin() {
    const loggedUser = this.getLoggedInUser();
    if (loggedUser == null) return false;
    else return loggedUser.role == 'admin';
  }
}
