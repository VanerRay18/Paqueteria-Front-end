import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiResponse } from '../models/ApiResponse';
import { environment } from 'src/environments/enviroment';

@Injectable({
  providedIn: 'root'
})
export class CarsService {

  constructor(
    private http: HttpClient
  ) { }


  getAllCars(): Observable<ApiResponse> {
    return this.http.get<ApiResponse>(`${environment.baseService}${'/cars'}`);
  }

  getFualCarLog(carId: any): Observable<ApiResponse> {
    let headers = new HttpHeaders({ 'carId': carId });

    return this.http.get<ApiResponse>(`${environment.baseService}${'/cars/fuelLogByCarId'}`, { headers });
  }


  createNewCar(data: any): Observable<ApiResponse> {
    return this.http.post<ApiResponse>(`${environment.baseService}${'/cars'}`, data);
  }

  createFuelLog(data: any): Observable<ApiResponse> {
    return this.http.post<ApiResponse>(`${environment.baseService}${'/cars/createFuelLog'}`, data);
  }

}
