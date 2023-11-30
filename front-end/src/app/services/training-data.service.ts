import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { firstValueFrom, map } from 'rxjs';
import { Paginated } from '../share/types/paginate.type';
import { TrainingData } from '../share/types/training-data.type';
@Injectable({
  providedIn: 'root',
})
export class TrainingDataService {
  private apiAllTrainingData: string = `http://localhost:3000/training-data`;

  constructor(private http: HttpClient) {}

  getAllTrainingData(queryString: string) {
    return this.http.get<Paginated<TrainingData>>(
      `${this.apiAllTrainingData}?${queryString}`
    );
  }

  async getTrainingData(id: number) {
    return firstValueFrom(
      this.http.get(`${this.apiAllTrainingData}/` + id).pipe(map((d: any) => d))
    ).catch((e) => false);
  }

  submitTrainingData(id: number = 0, data: {}) {
    if (id) {
      return firstValueFrom(
        this.http
          .patch(`${this.apiAllTrainingData}/` + id, data)
          .pipe(map((d: any) => d))
      ).catch((e) => false);
    } else {
      return firstValueFrom(
        this.http
          .post(`${this.apiAllTrainingData}`, data)
          .pipe(map((d: any) => d))
      ).catch((e) => false);
    }
  }

  deleteTrainingData(id: number) {
    return firstValueFrom(
      this.http
        .delete(`${this.apiAllTrainingData}/` + id)
        .pipe(map((d: any) => d))
    );
  }

  processSheet(fileName: string) {
    return this.http.get(
      `${this.apiAllTrainingData}/process-sheet/${fileName}`
    );
  }
}
