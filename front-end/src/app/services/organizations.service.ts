import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable, firstValueFrom, map } from "rxjs";
import { environment } from "src/environments/environment";

@Injectable({
  providedIn: 'root'
})
export class OrganizationsService {

  private apiAllOrganizations:string=`http://localhost:3000/organizations`;
  

  constructor(private http: HttpClient) { }


  async getOrganizations() {
   
    return firstValueFrom(
      this.http.get(`${this.apiAllOrganizations}`).pipe(map((d: any) => d))).catch((e) => false);
  }





  async getOrganization(code: string) {
    return firstValueFrom(
      this.http.get(`${this.apiAllOrganizations}/` + code).pipe(map((d: any) => d))
    ).catch((e) => false);
  }




}
