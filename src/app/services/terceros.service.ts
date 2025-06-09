import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiResponse } from 'src/app/models/ApiResponse';
import { environment } from 'src/environments/enviroment';

@Injectable({
  providedIn: 'root'
})
export class TercerosService {

  constructor(
    private http: HttpClient
  ) { }

  getInformation(userId : any): Observable<ApiResponse> {//Trae la nomina actual
    let headers = new HttpHeaders({ 'userId': userId })
    return this.http.get<ApiResponse>(`${environment.baseService}${'/servicioPersonal/type'}`,{ headers });
  }

  getInformationById(terceroId : any): Observable<ApiResponse> {//Trae la nomina actual
    let headers = new HttpHeaders({ 'terceroId': terceroId })
    return this.http.get<ApiResponse>(`${environment.baseService}${'/servicioPersonal/typeById'}`,{ headers });
  }

  getLayout(terceroId : any): Observable<ApiResponse> {//Trae la nomina actual
    let headers = new HttpHeaders({ 'terceroId': terceroId })
    return this.http.get<ApiResponse>(`${environment.baseService}${'/servicioPersonal/getLayaut'}`,{ headers });
  }

  SentLayout(file: File): Observable<ApiResponse> {
    const formData = new FormData();
    formData.append('file', file, file.name);
    return this.http.post<ApiResponse>(`${environment.baseService}/servicioPersonal/validatorFileLimitado`, formData);
  }

  validatorLayout(file: File, users: string, ilimitado: any): Observable<ApiResponse> {
    const formData = new FormData();
    formData.append('file', file, file.name);
    formData.append('users', users);
    formData.append('ilimitado', ilimitado);
    return this.http.post<ApiResponse>(`${environment.baseService}/servicioPersonal/validator`, formData);
  }

  validatorFormat(data: any, ilimitado: any): Observable<ApiResponse> {//Corrige el layout
    let headers = new HttpHeaders({ 'ilimitado': ilimitado })
    return this.http.post<ApiResponse>(`${environment.baseService}${'/servicioPersonal/validatorFormat'}`, data, { headers });
  }

  createLayout(data: any, terceroId: any): Observable<ApiResponse> {//Corrige el layout
    let headers = new HttpHeaders({ 'terceroId': terceroId })
    console.log(data);
    return this.http.post<ApiResponse>(`${environment.baseService}${'/servicioPersonal/createLayout'}`, data, { headers });
  }

  SaveLayout(data: any): Observable<ApiResponse> {
    // console.log(data);
    return this.http.post<ApiResponse>(`${environment.baseService}${'/servicioPersonal/saveTercero'}`, data);
  }

  changeStatus(terceroTotalId: any, status: any): Observable<ApiResponse> {//Cambia el estado de la nomina
    let headers = new HttpHeaders({'terceroTotalId': terceroTotalId, 'status': status})
    return this.http.post<ApiResponse>(`${environment.baseService}${'/servicioPersonal/changeStatus'}`,null,
      {headers}
    );
  }

}
