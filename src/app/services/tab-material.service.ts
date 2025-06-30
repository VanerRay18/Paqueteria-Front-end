import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiResponse } from '../models/ApiResponse';
import { environment } from 'src/environments/enviroment';

@Injectable({
  providedIn: 'root'
})
export class TabMaterialService {
  constructor(
    private http: HttpClient
  ) { }

  getMateriales(): Observable<ApiResponse> {
    return this.http.get<ApiResponse>(`${environment.baseService}${'/materials/quantityMaterial'}`);
  }

  quantityMaterial(catMaterialId: any, quantity: any): Observable<ApiResponse> {
    let headers = new HttpHeaders({ 'catMaterialId': catMaterialId, 'quantity': quantity });
    return this.http.post<ApiResponse>(`${environment.baseService}${'materials/quantityMaterial'}`, null,
      { headers }
    );
  }

  createMaterial(data: any): Observable<ApiResponse> {//Trae la nomina actual
    return this.http.post<ApiResponse>(`${environment.baseService}${'materials/cat'}`, data);
  }

  updateMaterial(data: any, materialId: any): Observable<ApiResponse> {
    let headers = new HttpHeaders({ 'materialId': materialId });
    return this.http.patch<ApiResponse>(`${environment.baseService}${'materials/cat'}`, data,
      { headers }
    );
  }

  deleteMaterial(materialId: any): Observable<ApiResponse> {
    let headers = new HttpHeaders({ 'materialId': materialId });
    return this.http.patch<ApiResponse>(`${environment.baseService}${'/cat/softdelete'}`, null,
      { headers }
    );
  }

  UpdateQuantityMaterial(catMaterialId: any, quantity: any): Observable<ApiResponse> {
    let headers = new HttpHeaders({ 'catMaterialId': catMaterialId, 'quantity': quantity });
    return this.http.patch<ApiResponse>(`${environment.baseService}${'materials/quantityMaterial'}`, null,
      { headers }
    );
  }

  DeleteQuantityMaterial(quantityMaterialId: any): Observable<ApiResponse> {
    let headers = new HttpHeaders({ 'quantityMaterialId': quantityMaterialId });
    return this.http.patch<ApiResponse>(`${environment.baseService}${'/materials/quantityMaterial/softdelete'}`, null,
      { headers }
    );
  }


}
