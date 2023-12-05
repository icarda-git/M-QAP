import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Paginated } from '../share/types/paginate.type';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ClarisaService {
  private api: string = `${environment.api_url}/clarisa`;

  constructor(private http: HttpClient) {}

  find(queryString: string) {
    return this.http.get<Paginated<any>>(`${this.api}?${queryString}`);
  }
}
