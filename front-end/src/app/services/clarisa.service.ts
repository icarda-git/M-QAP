import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Paginated } from '../share/types/paginate.type';

@Injectable({
  providedIn: 'root',
})
export class ClarisaService {
  private api: string = `http://localhost:3000/clarisa`;

  constructor(private http: HttpClient) {}

  find(queryString: string) {
    return this.http.get<Paginated<any>>(`${this.api}?${queryString}`);
  }
}
