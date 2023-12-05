import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { firstValueFrom, map } from 'rxjs';
import { Paginated } from '../share/types/paginate.type';
import { environment } from 'src/environments/environment';
@Injectable({
  providedIn: 'root',
})
export class TrainingCycleService {
  private api: string = `${environment.api_url}/training-cycle`;

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
}
