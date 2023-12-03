import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { firstValueFrom, map } from 'rxjs';
import { Paginated } from '../share/types/paginate.type';

@Injectable({
  providedIn: 'root',
})
export class OrganizationsService {
  private api: string = `http://localhost:3000/organizations`;

  constructor(private http: HttpClient) {}

  find(queryString: string) {
    return this.http.get<Paginated<any>>(`${this.api}?${queryString}`);
  }
  
  async getOrganizations() {
    return firstValueFrom(
      this.http.get(`${this.api}`).pipe(map((d: any) => d))
    );
  }

  async getOrganization(code: number) {
    return firstValueFrom(
      this.http
        .get(`${this.api}/` + code)
        .pipe(map((d: any) => d))
    );
  }

  searchOrganization(term: string) {
    return this.http
      .get(`${this.api}/search`, {
        params: {
          term,
        },
      })
      .pipe(map((d: any) => d));
  }
}
