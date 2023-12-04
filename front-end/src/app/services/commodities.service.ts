import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { firstValueFrom, map } from 'rxjs';
import { Paginated } from '../share/types/paginate.type';

@Injectable({
  providedIn: 'root',
})
export class CommoditiesService {
  private api: string = `http://localhost:3000/commodities`;

  constructor(private http: HttpClient) {}

  find(queryString: string) {
    return this.http.get<Paginated<any>>(`${this.api}?${queryString}`);
  }

  get(id: number) {
    return this.http.get(`${this.api}/` + id);
  }

  create(data: {}) {
    return this.http.post(`${this.api}`, data);
  }

  update(id: number, data: {}) {
    return this.http.patch(`${this.api}/` + id, data);
  }

  upsert(id: number | null | undefined, data: { [key: string]: any }) {
    return !!id ? this.update(id, data) : this.create(data);
  }

  delete(id: number) {
    return this.http.delete(`${this.api}/` + id);
  }

  processSheet(fileName: string) {
    return this.http.get(`${this.api}/process-sheet/${fileName}`);
  }
}
