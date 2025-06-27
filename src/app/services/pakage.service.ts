import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiResponse } from 'src/app/models/ApiResponse';
import { environment } from 'src/environments/enviroment';

@Injectable({
  providedIn: 'root'
})
export class PakageService {

  constructor(
    private http: HttpClient
  ) { }

  getPaqueterias(desde: any, hasta: any): Observable<ApiResponse> {
    let headers = new HttpHeaders({ 'desde': desde, 'hasta': hasta });
    return this.http.get<ApiResponse>(`${environment.baseService}${'/package/getOrgs'}`,
      { headers }
    );
  }

  getTokenAtt(): Observable<ApiResponse> {//Trae la nomina actual
    return this.http.post<ApiResponse>(`${environment.baseService}${'/attendances/tokenEmployee'}`, null);
  }

  getCargaById(PackageOrgId: any, desde: any, hasta: any, page: any, size: any): Observable<ApiResponse> {
    let headers = new HttpHeaders({ 'PackageOrgId': PackageOrgId, 'desde': desde, 'hasta': hasta, 'page': page, 'size': size });
    return this.http.get<ApiResponse>(`${environment.baseService}${'/package/incomingPackagesByPackageOrgId'}`, { headers });
  }

  getDeliveriesCar(): Observable<ApiResponse> {
    return this.http.get<ApiResponse>(`${environment.baseService}${'/package/deliveries'}`);
  }

  getPackagesDeliveryById(deliveryId: any, page: any, size: any): Observable<ApiResponse> {
    let headers = new HttpHeaders({ 'deliveryId': deliveryId, 'page': page, 'size': size });
    return this.http.get<ApiResponse>(`${environment.baseService}${'/package/packagesByDeliveryId'}`, { headers });
  }

  searchPackage(guia: any): Observable<ApiResponse> {
    let headers = new HttpHeaders({ 'guia': guia });
    return this.http.get<ApiResponse>(`${environment.baseService}${'/package/searchPackage'}`, { headers });
  }

  getDeliveryByEmployeeId(): Observable<ApiResponse> {
    return this.http.get<ApiResponse>(`${environment.baseService}${'/package/deliveryByEmployeeId'}`);
  }

  getPackageByCarga(incomingPackageId: any, page: any, size: any): Observable<ApiResponse> {
    let headers = new HttpHeaders({ 'incomingPackageId': incomingPackageId, 'page': page, 'size': size });
    return this.http.get<ApiResponse>(`${environment.baseService}${'/package/packagesByIncomingPackageId'}`, { headers });
  }
   getPackageByDelivery(deliveryId: any, page: any, size: any): Observable<ApiResponse> {
    let headers = new HttpHeaders({ 'deliveryId': deliveryId, 'page': page, 'size': size });
    return this.http.get<ApiResponse>(`${environment.baseService}${'/package/packagesByDeliveryId'}`, { headers });
  }

  searchPackageDelivery(guia : any, deliveryId: any): Observable<ApiResponse> {
    let headers = new HttpHeaders({ 'guia': guia, 'deliveryId': deliveryId });
    return this.http.get<ApiResponse>(`${environment.baseService}${'/package/searchPackageByDeliveryId'}`, { headers });
  }

  SentDataExel(data: any, incomingPackageId: any): Observable<ApiResponse> {//Trae la nomina actual
    let headers = new HttpHeaders({ 'incomingPackageId': incomingPackageId });
    return this.http.post<ApiResponse>(`${environment.baseService}${'/package/createDeliveryLoad'}`, data,
      { headers });
  }

  paquetesEscaneados(data: any, incomingPackageId: any): Observable<ApiResponse> {//Trae la nomina actual
    let headers = new HttpHeaders({ 'incomingPackageId': incomingPackageId });
    return this.http.post<ApiResponse>(`${environment.baseService}${'/package/createPackage'}`, data,
      { headers });
  }

  createIncoming(pakageOrgId: any, description: any): Observable<ApiResponse> {
    let headers = new HttpHeaders({ 'description': description, 'pakageOrgId': pakageOrgId });
    return this.http.post<ApiResponse>(`${environment.baseService}${'/package/createIncomingPackage'}`, null,
      { headers }
    );
  }

  MatchingPackage(incomingPackageId: any): Observable<ApiResponse> {
    let headers = new HttpHeaders({ 'incomingPackageId': incomingPackageId });
    return this.http.post<ApiResponse>(`${environment.baseService}${'/package/createMatchPackage'}`, null,
      { headers }
    );
  }

  createDeliveryCar(data: any): Observable<ApiResponse> {
    return this.http.post<ApiResponse>(`${environment.baseService}${'/package/createDelivery'}`, data,
    );
  }

  addPackagesCar(guia : any, deliveryId: any): Observable<ApiResponse> {
    let headers = new HttpHeaders({ 'deliveryId': deliveryId, 'guia': guia });
    return this.http.post<ApiResponse>(`${environment.baseService}${'/package/addPackagesInDelivery'}`, null,
      { headers }
    );
  }


  updatePackageStatus(packageId: any, catStatusId: any, description: any): Observable<ApiResponse> {
    let headers = new HttpHeaders({ 'packageId': packageId, 'catStatusId': catStatusId, 'description': description });
    return this.http.post<ApiResponse>(`${environment.baseService}${'/package/changeStatusPackage'}`, null,
      { headers }
    );
  }

    updateDeliveryStatus(deliveryId: any, catStatusId: any, description: any): Observable<ApiResponse> {
    let headers = new HttpHeaders({ 'deliveryId': deliveryId, 'catStatusId': catStatusId, 'description': description });
    return this.http.post<ApiResponse>(`${environment.baseService}${'/package/changeStatusDelivery'}`, null,
      { headers }
    );
  }

    createPackageWithConsolidado(packageId:any, description:any, data: any): Observable<ApiResponse> {
    let headers = new HttpHeaders({ 'packageId': packageId ,'description':description});
    return this.http.post<ApiResponse>(`${environment.baseService}${'/package/createPackageWithConsolidado'}`, data,
      { headers }
    );
  }

      updatePackageWithConsolidado(packageId:any, description:any, data: any): Observable<ApiResponse> {
    let headers = new HttpHeaders({ 'packageId': packageId ,'description':description});
    return this.http.patch<ApiResponse>(`${environment.baseService}${'/package/createPackageWithConsolidado'}`, data,
      { headers }
    );
  }
}
