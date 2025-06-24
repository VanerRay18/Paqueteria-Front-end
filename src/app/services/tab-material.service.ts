import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiResponse } from '../models/ApiResponse';
import { environment } from 'src/environments/enviroment';

@Injectable({
  providedIn: 'root'
})
export class TabMaterialService {
    constructor(
        private http:HttpClient
      ) { }

      getMateriales(): Observable<ApiResponse> {
          return this.http.get<ApiResponse>(`${environment.baseService}${'/materials/quantityMaterial'}`);
        }
}
