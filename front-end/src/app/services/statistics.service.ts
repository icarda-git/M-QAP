import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

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
  private api: string = `${environment.api_url}/statistics`;

  constructor(private http: HttpClient) {}

  find() {
    return this.http.get<Statistics>(`${this.api}`);
  }
}
