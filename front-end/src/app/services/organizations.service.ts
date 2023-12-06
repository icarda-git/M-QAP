import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs';
import { Paginated } from '../share/types/paginate.type';
import { environment } from 'src/environments/environment';
import { Organization } from '../share/types/organization.model.type';

@Injectable({
  providedIn: 'root',
})
export class OrganizationsService {
  private api: string = `${environment.api_url}/organizations`;

  constructor(private http: HttpClient) {}

  find(queryString: string) {
    return this.http.get<Paginated<Organization>>(`${this.api}?${queryString}`);
  }

  get(id: number) {
    return this.http.get(`${this.api}/` + id);
  }

  searchOrganization(term: string) {
    return this.http.get(`${this.api}/search`, {
      params: {
        term,
      },
    });
  }
}
