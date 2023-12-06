import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Paginated } from '../share/types/paginate.type';
import { TrainingData } from '../share/types/training-data.model.type';
import { environment } from 'src/environments/environment';
import { Upsert } from '../share/types/utilities';
@Injectable({
  providedIn: 'root',
})
export class TrainingDataService {
  private api: string = `${environment.api_url}/training-data`;

  constructor(private http: HttpClient) {}

  find(queryString: string) {
    return this.http.get<Paginated<TrainingData>>(`${this.api}?${queryString}`);
  }

  get(id: number) {
    return this.http.get(`${this.api}/` + id);
  }

  create(data: Upsert<TrainingData>) {
    return this.http.post(`${this.api}`, data);
  }

  update(id: number, data: Upsert<TrainingData>) {
    return this.http.patch(`${this.api}/` + id, data);
  }

  upsert(id: number | null | undefined, data: Upsert<TrainingData>) {
    return !!id ? this.update(id, data) : this.create(data);
  }

  delete(id: number) {
    return this.http.delete(`${this.api}/` + id);
  }

  processSheet(fileName: string) {
    return this.http.get(`${this.api}/process-sheet/${fileName}`);
  }
}
