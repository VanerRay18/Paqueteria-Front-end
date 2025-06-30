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

  getCarById(carId: any): Observable<ApiResponse> {
    let headers = new HttpHeaders({ 'carId': carId });
    return this.http.get<ApiResponse>(`${environment.baseService}${'/cars/car'}`, { headers });
  }

  getCatEmpl(): Observable<ApiResponse> {
    return this.http.get<ApiResponse>(`${environment.baseService}${'/employees/catEmployee'}`);
  }


  getFualCarLog(carId: any): Observable<ApiResponse> {
    let headers = new HttpHeaders({ 'carId': carId });

    return this.http.get<ApiResponse>(`${environment.baseService}${'/cars/fuelLogByCarId'}`, { headers });
  }


  getCatService(): Observable<ApiResponse> {
    return this.http.get<ApiResponse>(`${environment.baseService}${'/cars/catServices'}`);
  }

  getHistoryService(carId: any): Observable<ApiResponse> {
    let headers = new HttpHeaders({ 'carId': carId });
    return this.http.get<ApiResponse>(`${environment.baseService}${'/cars/servicesHistoryByCarId'}`, { headers });
  }

  getActualService(carId: any): Observable<ApiResponse> {
    let headers = new HttpHeaders({ 'carId': carId });
    return this.http.get<ApiResponse>(`${environment.baseService}${'/cars/servicesCurrentByCarId'}`, { headers });
  }

  addService(data: any): Observable<ApiResponse> {
    return this.http.post<ApiResponse>(`${environment.baseService}${'/cars/addService'}`, data);
  }

  updateService(data: any, serviceId: any): Observable<ApiResponse> {
    let headers = new HttpHeaders({ 'serviceId': serviceId });
    return this.http.patch<ApiResponse>(`${environment.baseService}${'/cars/updateService'}`, data, { headers });
  }

  deleteService(data: any, serviceId: any): Observable<ApiResponse> {
    let headers = new HttpHeaders({ 'serviceId': serviceId });
    return this.http.patch<ApiResponse>(`${environment.baseService}${'/cars/updateService/softdele'}`, data, { headers });
  }

  createNewCar(data: any): Observable<ApiResponse> {
    return this.http.post<ApiResponse>(`${environment.baseService}${'/cars'}`, data);
  }

  SaveFoto(data: FormData, description: any, targetId: any, type: any): Observable<ApiResponse> {
    let headers = new HttpHeaders({
      'description': description,
      'carId': targetId.toString(),
      'type': type
    });
    return this.http.post<ApiResponse>(`${environment.baseService}/files/saveFiles`, data, {
      headers
    });
  }


  deleteFile(targetIds: any): Observable<ApiResponse> {
    let headers = new HttpHeaders({ 'targetIds ': targetIds });
    return this.http.patch<ApiResponse>(`${environment.baseService}${'/files/softdelete'}`, { headers });
  }

  deleteCar(carId: any): Observable<ApiResponse> {
    let headers = new HttpHeaders({ 'carId': carId });
    console.log(carId);
    return this.http.patch<ApiResponse>(`${environment.baseService}${'/cars/softdelete'}`, null, { headers });
  }


  createFuelLog(data: any): Observable<ApiResponse> {
    return this.http.post<ApiResponse>(`${environment.baseService}${'/cars/createFuelLog'}`, data);
  }

  updateCar(data: any, carId: any): Observable<ApiResponse> {
    let headers = new HttpHeaders({ 'carId': carId });
    return this.http.patch<ApiResponse>(`${environment.baseService}${'/cars'}`, data, { headers });
  }

}
