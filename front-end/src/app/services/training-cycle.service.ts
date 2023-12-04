import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { firstValueFrom, map } from 'rxjs';
import { Paginated } from '../share/types/paginate.type';
@Injectable({
  providedIn: 'root',
})
export class TrainingCycleService {
  private apiAllTrainingCycle: string = `http://localhost:3000/training-cycle`;

  constructor(private http: HttpClient) {}

  find(queryString: string) {
    return this.http.get<Paginated<any>>(
      `${this.apiAllTrainingCycle}?${queryString}`
    );
  }

  async getTrainingCycle(id: number) {
    return firstValueFrom(
      this.http
        .get(`${this.apiAllTrainingCycle}/` + id)
        .pipe(map((d: any) => d))
    ).catch((e) => false);
  }

  submitTrainingCycle(id: number = 0, data: {}) {
    if (id) {
      return firstValueFrom(
        this.http
          .patch(`${this.apiAllTrainingCycle}/` + id, data)
          .pipe(map((d: any) => d))
      ).catch((e) => false);
    } else {
      return firstValueFrom(
        this.http
          .post(`${this.apiAllTrainingCycle}`, data)
          .pipe(map((d: any) => d))
      ).catch((e) => false);
    }
  }

  deleteTrainingCycle(id: number) {
    return firstValueFrom(
      this.http
        .delete(`${this.apiAllTrainingCycle}/` + id)
        .pipe(map((d: any) => d))
    );
  }
}
