import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiResponse } from 'src/app/models/ApiResponse';
import { environment } from 'src/environments/enviroment';

@Injectable({
  providedIn: 'root'
})
export class RHService {

  constructor(
    private http:HttpClient
  ) { }

  getCatalogos(): Observable<ApiResponse> {
    return this.http.get<ApiResponse>(`${environment.baseService}${'/employees/allCatsRH'}`);
  }

  createEmployee(data:any): Observable<ApiResponse> {//Trae la nomina actual
    return this.http.post<ApiResponse>(`${environment.baseService}${'/employees'}`,data);
  }


}
