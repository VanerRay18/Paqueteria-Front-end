import { Injectable } from '@angular/core';
import { Observable, of, tap } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ApiResponse } from '../models/ApiResponse';
import { environment } from 'src/environments/enviroment';

@Injectable({
  providedIn: 'root'
})
export class AdminService {

  constructor(
    private http:HttpClient
  ) { }

  createUser(data: any): Observable<any> {
    return this.http.post<any>(`${environment.baseService}${'/user'}`, data, {observe:'response'})
  }
  getModulesAssignation(): Observable<ApiResponse> {
    return this.http.get<any>(`${environment.baseService}${'/module/asignacion'}`);
  }
  getAllUser(): Observable<ApiResponse> {
    return this.http.get<any>(`${environment.baseService}${'/user/AllUsersERP'}`);
  }

  getRolAssignation(): Observable<ApiResponse> {
    return this.http.get<any>(`${environment.baseService}${'/rol/asignacion'}`);
  }

  
  getEmails(data: FormData): Observable<ApiResponse> {
    return this.http.post<ApiResponse>(`${environment.baseService}${'/nomina/sentArchive'}`,data);
  }

}
