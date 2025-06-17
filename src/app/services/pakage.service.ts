import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiResponse } from 'src/app/models/ApiResponse';
import { environment } from 'src/environments/enviroment';

@Injectable({
  providedIn: 'root'
})
export class PakageService {

  constructor(
    private http:HttpClient
  ) { }

  getPaqueterias(): Observable<ApiResponse> {
    return this.http.get<ApiResponse>(`${environment.baseService}${'/package/getOrgs'}`);
  }

  getTokenAtt(): Observable<ApiResponse> {//Trae la nomina actual
    return this.http.post<ApiResponse>(`${environment.baseService}${'/attendances/tokenEmployee'}`,null);
  }

  SentDataExel(data:any, incomingPackageId: any): Observable<ApiResponse> {//Trae la nomina actual
    let headers = new HttpHeaders({'incomingPackageId': incomingPackageId});
    return this.http.post<ApiResponse>(`${environment.baseService}${'/package/createDeliveryLoad'}`,data,
      {headers});
  }

  createIncoming(pakageOrgId :any, description : any): Observable<ApiResponse> {
    let headers = new HttpHeaders({'description': description, 'pakageOrgId': pakageOrgId});
    return this.http.post<ApiResponse>(`${environment.baseService}${'/package/createIncomingPackage'}`, null,
      {headers}
    );
  }


}
