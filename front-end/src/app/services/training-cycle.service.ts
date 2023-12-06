import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Paginated } from '../share/types/paginate.type';
import { environment } from 'src/environments/environment';
import { TrainingCycle } from '../share/types/training-cycle.model.type';
import { Upsert } from '../share/types/utilities';
@Injectable({
  providedIn: 'root',
})
export class TrainingCycleService {
  private api: string = `${environment.api_url}/training-cycle`;

  constructor(private http: HttpClient) {}

  find(queryString: string) {
    return this.http.get<Paginated<TrainingCycle>>(
      `${this.api}?${queryString}`
    );
  }

  get(id: number) {
    return this.http.get(`${this.api}/` + id);
  }

  create(data: Upsert<TrainingCycle, 'id' | 'creation_date' | 'update_date'>) {
    return this.http.post(`${this.api}`, data);
  }

  update(
    id: number,
    data: Upsert<TrainingCycle, 'id' | 'creation_date' | 'update_date'>
  ) {
    return this.http.patch(`${this.api}/` + id, data);
  }

  upsert(
    id: number | null | undefined,
    data: Upsert<TrainingCycle, 'id' | 'creation_date' | 'update_date'>
  ) {
    return !!id ? this.update(id, data) : this.create(data);
  }

  delete(id: number) {
    return this.http.delete(`${this.api}/` + id);
  }
}
