import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Paginated } from '../share/types/paginate.type';
import { environment } from 'src/environments/environment';
import { Prediction } from '../share/types/prediction.model.type';

@Injectable({
  providedIn: 'root',
})
export class PredictionsService {
  private api: string = `${environment.api_url}/predictions`;

  constructor(private http: HttpClient) {}

  find(queryString: string) {
    return this.http.get<Paginated<Prediction>>(`${this.api}?${queryString}`);
  }

  get(id: number) {
    return this.http.get(`${this.api}/` + id);
  }

  delete(id: number) {
    return this.http.delete(`${this.api}/` + id);
  }
}
