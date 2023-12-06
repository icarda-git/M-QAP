import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Paginated } from '../share/types/paginate.type';
import { environment } from 'src/environments/environment';
import { Commodity } from '../share/types/commodity.model.type';
import { Upsert } from '../share/types/utilities';

@Injectable({
  providedIn: 'root',
})
export class CommoditiesService {
  private api: string = `${environment.api_url}/commodities`;

  constructor(private http: HttpClient) {}

  find(queryString: string) {
    return this.http.get<Paginated<Commodity>>(`${this.api}?${queryString}`);
  }

  get(id: number) {
    return this.http.get<Commodity>(`${this.api}/` + id);
  }

  create(data: Upsert<Commodity, 'id'>) {
    return this.http.post<Commodity>(`${this.api}`, data);
  }

  update(id: number, data: Upsert<Commodity, 'id' | 'parent_id'>) {
    return this.http.patch<Commodity>(`${this.api}/` + id, data);
  }

  upsert(id: number | null | undefined, data: Upsert<Commodity>) {
    return !!id ? this.update(id, data) : this.create(data);
  }

  delete(id: number) {
    return this.http.delete(`${this.api}/` + id);
  }

  processSheet(fileName: string) {
    return this.http.get(`${this.api}/process-sheet/${fileName}`);
  }
}
