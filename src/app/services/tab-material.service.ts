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

  getMaterialById(catMaterialId: any): Observable<ApiResponse> {
    let headers = new HttpHeaders({ 'catMaterialId': catMaterialId });
    return this.http.get<ApiResponse>(`${environment.baseService}${'/materials/getAQuantityMaterial'}`, { headers });
  }



  quantityMaterial(catMaterialId: any, quantity: any): Observable<ApiResponse> {
    let headers = new HttpHeaders({ 'catMaterialId': catMaterialId, 'quantity': quantity });
    return this.http.post<ApiResponse>(`${environment.baseService}${'/materials/quantityMaterial'}`, null,
      { headers }
    );
  }

  createMaterial(data: any): Observable<ApiResponse> {//Trae la nomina actual
    return this.http.post<ApiResponse>(`${environment.baseService}${'/materials/cat'}`, data);
  }

  updateMaterial(data: any, catMaterialId: any): Observable<ApiResponse> {
    let headers = new HttpHeaders({ 'catMaterialId': catMaterialId });
    return this.http.patch<ApiResponse>(`${environment.baseService}${'/materials/cat'}`, data,
      { headers }
    );
  }

  deleteMaterial(catMaterialId: any): Observable<ApiResponse> {
    let headers = new HttpHeaders({ 'catMaterialId': catMaterialId });
    return this.http.patch<ApiResponse>(`${environment.baseService}${'/materials/cat/softdelete'}`, null,
      { headers }
    );
  }

  UpdateQuantityMaterial(catMaterialId: number, quantity: number): Observable<ApiResponse> {
    let headers = new HttpHeaders({ 'catMaterialId': catMaterialId, 'quantity': quantity });
    return this.http.patch<ApiResponse>(`${environment.baseService}${'/materials/quantityMaterial'}`, null,
      { headers }
    );
  }

  DeleteQuantityMaterial(quantityMaterialId: any): Observable<ApiResponse> {
    let headers = new HttpHeaders({ 'quantityMaterialId': quantityMaterialId });
    return this.http.patch<ApiResponse>(`${environment.baseService}${'/materials/quantityMaterial/softdelete'}`, null,
      { headers }
    );
  }

  //uniformes
  getUniformes(): Observable<any> {
    return this.http.get<ApiResponse>(`${environment.baseService}${'/uniforms/inventory'}`);
  }

  addUniformeToEmployee(employeeId: any, productItemId: any, cant: any): Observable<ApiResponse> {
    return this.http.post<ApiResponse>(`${environment.baseService}${`/uniforms/assiged/employee/${employeeId}/product-item/${productItemId}/cant/${cant}`}`, null);
  }

  updateCantUniform(itemId: any, productItemId: any, cant: any, uniformId: any): Observable<ApiResponse> {
    return this.http.patch<ApiResponse>(`${environment.baseService}${`/uniforms/${uniformId}/item/${itemId}/product/${productItemId}/cant/${cant}`}`, null);
  }


}
