import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { firstValueFrom, map } from "rxjs";
import { environment } from "src/environments/environment";
@Injectable({
  providedIn: 'root'
})
export class TrainningDataService {

  private apiAllTrainningData:string=`http://localhost:3000/trainning-data`;
  

  constructor(private http: HttpClient) { }


  async getAllTrainningData() {
    
    return firstValueFrom(
      this.http.get(`${this.apiAllTrainningData}`).pipe(map((d: any) => d))
    ).catch((e) => false);
  }

  async getTrainningData(id: number) {
    return firstValueFrom(
      this.http.get(`${this.apiAllTrainningData}/` + id).pipe(map((d: any) => d))
    ).catch((e) => false);
  }

  submitTrainningData(id: number = 0, data: {}) {
    if (id) {
      return firstValueFrom(
        this.http.patch(`${this.apiAllTrainningData}/` + id, data).pipe(map((d: any) => d))
      ).catch((e) => false);
    } else {
      return firstValueFrom(
        this.http.post(`${this.apiAllTrainningData}`, data).pipe(map((d: any) => d))
      ).catch((e) => false);
    }
  }
  deleteTrainningData(id: number) {
    return firstValueFrom(
      this.http.delete(`${this.apiAllTrainningData}/` + id).pipe(map((d: any) => d))
    );
  }
}
