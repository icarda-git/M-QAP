import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

export type Statistics = {
  totalCommodities: number;
  totalOrganization: number;
  totalTrainingCycle: number;
  totalPrediction: number;
  chartData: {
    cycle_id: number;
    predictions_count: number;
  }[];
  cyclePredictionsAverage: {
    predictions_average: number;
    cycle_id: number;
  }[];
};

@Injectable({
  providedIn: 'root',
})
export class StatisticsService {
  private api: string = `http://localhost:3000/statistics`;

  constructor(private http: HttpClient) {}

  find() {
    return this.http.get<Statistics>(`${this.api}`);
  }
}
