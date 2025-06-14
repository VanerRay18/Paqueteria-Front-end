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

  getAttencendance(): Observable<ApiResponse> {
    return this.http.get<ApiResponse>(`${environment.baseService}${'/attendances'}`);
  }


  getAttencendanceById(employeeId: any, typeId: any, desde: any, hasta: any): Observable<ApiResponse> {
    let headers = new HttpHeaders({'employeeId': employeeId, 'typeId': typeId, 'desde': desde, 'hasta': hasta});
    return this.http.get<ApiResponse>(`${environment.baseService}${'/attendances/employeeId'}`,
      {headers}
    );
  }

  createAdress(data:any, employeeId: any): Observable<ApiResponse> {
    let headers = new HttpHeaders({'employeeId': employeeId});
    return this.http.post<ApiResponse>(`${environment.baseService}${'/employees/address'}`, data,
      {headers}
    );
  }

  createEmployee(data:any): Observable<ApiResponse> {//Trae la nomina actual
    return this.http.post<ApiResponse>(`${environment.baseService}${'/employees'}`,data);
  }

  validateToken(token: any): Observable<ApiResponse> {
    let headers = new HttpHeaders({'token': token});
    return this.http.post<ApiResponse>(`${environment.baseService}${'/attendances/checkAttendance'}`, null,
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
