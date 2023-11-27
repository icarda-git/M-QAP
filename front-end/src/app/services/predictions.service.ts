import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { firstValueFrom, map } from "rxjs";
import { environment } from "src/environments/environment";

@Injectable({
  providedIn: 'root'
})
export class PredictionsService {

  private apiAllPredictions:string=`http://localhost:3000/predictions`;
  

  constructor(private http: HttpClient) { }

  


  async getAllPredictions() {
   
    return firstValueFrom(
      this.http.get(`${this.apiAllPredictions}`).pipe(map((d: any) => d))).catch((e) => false);
  }



  async getPredictions(id: number) {
    return firstValueFrom(
      this.http.get(`${this.apiAllPredictions}/` + id).pipe(map((d: any) => d))
    ).catch((e) => false);
  }




 

}
