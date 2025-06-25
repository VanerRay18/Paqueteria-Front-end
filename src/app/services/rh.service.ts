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
    private http: HttpClient
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


  getAttencendanceById(employeeId: any, typeId: any, desde: any, hasta: any, page: any, size: any): Observable<ApiResponse> {
    let headers = new HttpHeaders({ 'employeeId': employeeId, 'typeId': typeId, 'desde': desde, 'hasta': hasta, 'page': page, 'size': size });
    return this.http.get<ApiResponse>(`${environment.baseService}${'/attendances/employeeId'}`,
      { headers }
    );
  }

  getEmployeeById(employeeId: any): Observable<ApiResponse> {
    let headers = new HttpHeaders({ 'employeeId': employeeId });
    return this.http.get<ApiResponse>(`${environment.baseService}${'/employees/getAllDataEmployee'}`,
      { headers }
    );
  }

  createAdress(data: any, employeeId: any): Observable<ApiResponse> {
    let headers = new HttpHeaders({ 'employeeId': employeeId });
    return this.http.post<ApiResponse>(`${environment.baseService}${'/employees/address'}`, data,
      { headers }
    );
  }

  createEmployee(data: any): Observable<ApiResponse> {//Trae la nomina actual
    return this.http.post<ApiResponse>(`${environment.baseService}${'/employees'}`, data);
  }

  validateToken(token: any): Observable<ApiResponse> {
    let headers = new HttpHeaders({ 'token': token });
    return this.http.post<ApiResponse>(`${environment.baseService}${'/attendances/checkAttendance'}`, null,
      { headers }
    );
  }

SaveFoto(data: FormData, employeeId: any): Observable<ApiResponse> {
  let headers = new HttpHeaders({
    'employeeId': employeeId.toString()
  });
  return this.http.post<ApiResponse>(`${environment.baseService}/employees/saveFilesEmployee`, data, {
    headers
  });
}

  SaveDocuments(data: any, employeeId: any): Observable<ApiResponse> {
    let headers = new HttpHeaders({ 'employeeId': employeeId });
    console.log(employeeId);
    return this.http.post<ApiResponse>(`${environment.baseService}${'/employees/documents'}`, data,
      { headers }
    );
  }

  SaveUniforms(data: any, employeeId: any): Observable<ApiResponse> {
    let headers = new HttpHeaders({ 'employeeId': employeeId });
    return this.http.post<ApiResponse>(`${environment.baseService}${'/employees/material'}`, data,
      { headers }
    );
  }

  SavePay(data: any, employeeId: any): Observable<ApiResponse> {
    let headers = new HttpHeaders({ 'employeeId': employeeId });
    return this.http.post<ApiResponse>(`${environment.baseService}${'/employees/bankAccount'}`, data,
      { headers }
    );
  }

  SaveEmergency(data: any, employeeId: any): Observable<ApiResponse> {
    let headers = new HttpHeaders({ 'employeeId': employeeId });
    return this.http.post<ApiResponse>(`${environment.baseService}${'/employees/emergencyContact'}`, data,
      { headers }
    );
  }

  SavephoneBermed(data: any, employeeId: any): Observable<ApiResponse> {
    let headers = new HttpHeaders({ 'employeeId': employeeId });
    return this.http.post<ApiResponse>(`${environment.baseService}${'/employees/phoneBermed'}`, data,
      { headers }
    );
  }


  UpdateAddress(data: any, employeeId: any): Observable<ApiResponse> {
    let headers = new HttpHeaders({ 'employeeId': employeeId });
    return this.http.patch<ApiResponse>(`${environment.baseService}${'/employees/address'}`, data,
      { headers }
    );
  }

  UpdateEmployee(data: any, employeeId: any): Observable<ApiResponse> {//Trae la nomina actual
    let headers = new HttpHeaders({ 'employeeId': employeeId });
    return this.http.patch<ApiResponse>(`${environment.baseService}${'/employees'}`, data,
      { headers }
    );
  }

  UpdateEmergency(data: any, employeeId: any): Observable<ApiResponse> {
    let headers = new HttpHeaders({ 'employeeId': employeeId });
    return this.http.patch<ApiResponse>(`${environment.baseService}${'/employees/emergencyContact'}`, data,
      { headers }
    );
  }

  UpdatePhoneBermed(data: any, employeeId: any): Observable<ApiResponse> {
    let headers = new HttpHeaders({ 'employeeId': employeeId });
    return this.http.patch<ApiResponse>(`${environment.baseService}${'/employees/phoneBermed'}`, data,
      { headers }
    );
  }

  UpdateDocuments(data: any, employeeId: any): Observable<ApiResponse> {
    let headers = new HttpHeaders({ 'employeeId': employeeId });
    console.log(employeeId);
    return this.http.patch<ApiResponse>(`${environment.baseService}${'/employees/documents'}`, data,
      { headers }
    );
  }

  UpdateUniforms(data: any, employeeId: any): Observable<ApiResponse> {
    let headers = new HttpHeaders({ 'employeeId': employeeId });
    return this.http.patch<ApiResponse>(`${environment.baseService}${'/employees/material'}`, data,
      { headers }
    );
  }

  UpdatePay(data: any, employeeId: any): Observable<ApiResponse> {
    let headers = new HttpHeaders({ 'employeeId': employeeId });
    return this.http.patch<ApiResponse>(`${environment.baseService}${'/employees/bankAccount'}`, data,
      { headers }
    );
  }



  UpdateAttendance(data: any, attendanceId: any): Observable<ApiResponse> {//Trae la nomina actual
    let headers = new HttpHeaders({ 'attendanceId': attendanceId });
    console.log(data);
    return this.http.patch<ApiResponse>(`${environment.baseService}${'/attendances/attendance'}`, data,
      { headers });
  }

  DeleteEmployee(employeeId: any): Observable<ApiResponse> {
    let headers = new HttpHeaders({ 'employeeId': employeeId });
    return this.http.patch<ApiResponse>(`${environment.baseService}${'/employees/softdelete'}`, null,
     { headers }
    );
  }

}
