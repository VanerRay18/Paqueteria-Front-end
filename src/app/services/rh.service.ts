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

  getEmployees(): Observable<ApiResponse> {
    return this.http.get<ApiResponse>(`${environment.baseService}${'/employees'}`);
  }

  getCatalogos(): Observable<ApiResponse> {
    return this.http.get<ApiResponse>(`${environment.baseService}${'/employees/allCatsRH'}`);
  }

  createEmployee(data:any): Observable<ApiResponse> {//Trae la nomina actual
    return this.http.post<ApiResponse>(`${environment.baseService}${'/employees'}`,data);
  }

  createAdress(data:any, employeeId: any): Observable<ApiResponse> {
    let headers = new HttpHeaders({'employeeId': employeeId});
    return this.http.post<ApiResponse>(`${environment.baseService}${'/employees/address'}`, data,
      {headers}
    );
  }

  SaveDocuments(data:any, employeeId: any): Observable<ApiResponse> {
    let headers = new HttpHeaders({'employeeId': employeeId});
    return this.http.post<ApiResponse>(`${environment.baseService}${'/employees/documents'}`, data,
      {headers}
    );
  }

  SaveUniforms(data:any, employeeId: any): Observable<ApiResponse> {
    let headers = new HttpHeaders({'employeeId': employeeId});
    return this.http.post<ApiResponse>(`${environment.baseService}${'/employees/material'}`, data,
      {headers}
    );
  }

  SavePay(data:any, employeeId: any): Observable<ApiResponse> {
    let headers = new HttpHeaders({'employeeId': employeeId});
    return this.http.post<ApiResponse>(`${environment.baseService}${'/employees/bankAccount'}`, data,
      {headers}
    );
  }

  SaveEmergency(data:any, employeeId: any): Observable<ApiResponse> {
    let headers = new HttpHeaders({'employeeId': employeeId});
    return this.http.post<ApiResponse>(`${environment.baseService}${'/employees/emergencyContact'}`, data,
      {headers}
    );
  }

  SavephoneBermed(data:any, employeeId: any): Observable<ApiResponse> {
    let headers = new HttpHeaders({'employeeId': employeeId});
    return this.http.post<ApiResponse>(`${environment.baseService}${'/employees/phoneBermed'}`, data,
      {headers}
    );
  }

}
