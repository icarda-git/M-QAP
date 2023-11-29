import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable, firstValueFrom, map } from "rxjs";
import { environment } from "src/environments/environment";


@Injectable({
  providedIn: 'root'
})
export class CommoditiesService {

  private apiAllCommodities:string=`http://localhost:3000/commodities`;
  

  constructor(private http: HttpClient) { }

  async getAllCommodities() {
   
    return firstValueFrom(
      this.http.get(`${this.apiAllCommodities}`).pipe(map((d: any) => d))).catch((e) => false);
  }



  async getCommodities(id: number) {
    return firstValueFrom(
      this.http.get(`${this.apiAllCommodities}/` + id).pipe(map((d: any) => d))
    ).catch((e) => false);
  }


}
