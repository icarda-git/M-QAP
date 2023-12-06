import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Statistics } from '../share/types/statistics.model.type';



@Injectable({
  providedIn: 'root',
})
export class StatisticsService {
  private api: string = `${environment.api_url}/statistics`;

  constructor(private http: HttpClient) {}

  find() {
    return this.http.get<Statistics>(`${this.api}`);
  }
}
