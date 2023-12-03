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

  async getTrainingData(id: number) {
    return firstValueFrom(
      this.http.get(`${this.api}/` + id).pipe(map((d: any) => d))
    ).catch((e) => false);
  }

  submitTrainingData(id: number = 0, data: {}) {
    if (id) {
      return firstValueFrom(
        this.http.patch(`${this.api}/` + id, data).pipe(map((d: any) => d))
      ).catch((e) => false);
    } else {
      return firstValueFrom(
        this.http.post(`${this.api}`, data).pipe(map((d: any) => d))
      ).catch((e) => false);
    }
  }

  deleteTrainingData(id: number) {
    return firstValueFrom(
      this.http.delete(`${this.api}/` + id).pipe(map((d: any) => d))
    );
  }

  processSheet(fileName: string) {
    return this.http.get(`${this.api}/process-sheet/${fileName}`);
  }
}
