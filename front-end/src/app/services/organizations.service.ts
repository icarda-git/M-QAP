import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { firstValueFrom, map } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class OrganizationsService {
  private apiAllOrganizations: string = `http://localhost:3000/organizations`;

  constructor(private http: HttpClient) {}

  async getOrganizations() {
    return firstValueFrom(
      this.http.get(`${this.apiAllOrganizations}`).pipe(map((d: any) => d))
    );
  }

  async getOrganization(code: number) {
    return firstValueFrom(
      this.http
        .get(`${this.apiAllOrganizations}/` + code)
        .pipe(map((d: any) => d))
    );
  }

  searchOrganization(term: string) {
    return this.http
      .get(`${this.apiAllOrganizations}/search`, {
        params: {
          term,
        },
      })
      .pipe(map((d: any) => d));
  }
}
