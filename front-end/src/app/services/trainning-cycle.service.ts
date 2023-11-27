import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { firstValueFrom, map } from "rxjs";
import { environment } from "src/environments/environment";
@Injectable({
  providedIn: 'root'
})
export class TrainningCycleService {


  private apiAllTrainningCycle:string=`http://localhost:3000/trainning-cycle`;
  

  constructor(private http: HttpClient) { }




  async getAllTrainningCycle() {
   
    return firstValueFrom(
      this.http.get(`${this.apiAllTrainningCycle}`).pipe(map((d: any) => d))).catch((e) => false);
  }



  async getTrainningCycle(id: number) {
    return firstValueFrom(
      this.http.get(`${this.apiAllTrainningCycle}/` + id).pipe(map((d: any) => d))
    ).catch((e) => false);
  }



  



  submitTrainningCycle(id: number = 0, data: {}) {
    if (id) {
      return firstValueFrom(
        this.http.patch(`${this.apiAllTrainningCycle}/` + id, data).pipe(map((d: any) => d))
      ).catch((e) => false);
    } else {
      return firstValueFrom(
        this.http.post(`${this.apiAllTrainningCycle}`, data).pipe(map((d: any) => d))
      ).catch((e) => false);
    }
  }


  
  deleteTrainningCycle(id: number) {
    return firstValueFrom(
      this.http.delete(`${this.apiAllTrainningCycle}/` + id).pipe(map((d: any) => d))
    );
  }

}
