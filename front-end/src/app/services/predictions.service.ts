import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { firstValueFrom, map } from 'rxjs';
import { Paginated } from '../share/types/paginate.type';

@Injectable({
  providedIn: 'root',
})
export class PredictionsService {
  private api: string = `http://localhost:3000/predictions`;

  constructor(private http: HttpClient) {}

  find(queryString: string) {
    return this.http.get<Paginated<any>>(`${this.api}?${queryString}`);
  }

  async getPredictions(id: number) {
    return firstValueFrom(
      this.http.get(`${this.api}/` + id).pipe(map((d: any) => d))
    ).catch((e) => false);
  }
}
