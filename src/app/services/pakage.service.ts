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

  getAllPackages(headers: HttpHeaders): Observable<ApiResponse> {
    return this.http.get<ApiResponse>(`${environment.baseService}${'/package/getAllPackages'}`, { headers });
  }


  getDeliveriesCar(page: any, size: any): Observable<ApiResponse> {
    let headers = new HttpHeaders({ 'page': page, 'size': size });
    return this.http.get<ApiResponse>(`${environment.baseService}${'/package/deliveries'}`, { headers });
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

  getPackageByCarga(incomingPackageId: any, page: any, size: any, isCost: any): Observable<ApiResponse> {
    let headers = new HttpHeaders({ 'incomingPackageId': incomingPackageId, 'page': page, 'size': size, 'isCost': isCost });
    return this.http.get<ApiResponse>(`${environment.baseService}${'/package/packagesByIncomingPackageId'}`, { headers });
  }
  getPackageByDelivery(deliveryId: any, page: any, size: any, isCost: any): Observable<ApiResponse> {
    let headers = new HttpHeaders({ 'deliveryId': deliveryId, 'page': page, 'size': size, 'isCost': isCost });
    return this.http.get<ApiResponse>(`${environment.baseService}${'/package/packagesByDeliveryId'}`, { headers });
  }

  getPDex(): Observable<ApiResponse> {
    return this.http.get<ApiResponse>(`${environment.baseService}${'/package/getDex'}`);
  }

  searchPackageDelivery(guia: any, deliveryId: any): Observable<ApiResponse> {
    let headers = new HttpHeaders({ 'guia': guia, 'deliveryId': deliveryId });
    return this.http.get<ApiResponse>(`${environment.baseService}${'/package/searchPackageByDeliveryId'}`, { headers });
  }

  getConfigPackageOrg(headers: HttpHeaders): Observable<ApiResponse> {
    return this.http.get<ApiResponse>(`${environment.baseService}${'/package/getConfigPackageOrg'}`, { headers });
  }

  getCatPakageOrg(): Observable<ApiResponse> {
    return this.http.get<ApiResponse>(`${environment.baseService}${'/package/getCatPackageOrg'}`);
  }

  getCatEmpl(): Observable<ApiResponse> {
    return this.http.get<ApiResponse>(`${environment.baseService}${'/employees/catEmployee'}`);
  }

  getHistoryByPakage(packageId: any): Observable<ApiResponse> {
    let headers = new HttpHeaders({ 'packageId': packageId });
    return this.http.get<ApiResponse>(`${environment.baseService}${'/package/packageHistory'}`, { headers });
  }


  SentDataExel(data: any, incomingPackageId: any): Observable<ApiResponse> {//Trae la nomina actual
    let headers = new HttpHeaders({ 'incomingPackageId': incomingPackageId });
    return this.http.post<ApiResponse>(`${environment.baseService}${'/package/createDeliveryLoad'}`, data,
      { headers });
  }


  paquetesEscaneados(guia: any, incomingPackageId: any): Observable<ApiResponse> {//Trae la nomina actual
    let headers = new HttpHeaders({ 'incomingPackageId': incomingPackageId, 'guia': guia,});
    return this.http.post<ApiResponse>(`${environment.baseService}${'/package/createPackage'}`, null,
      { headers });
  }

  addPackagesInDelivery(guia: any, deliveryId: any): Observable<ApiResponse> {//Trae la nomina actual
    let headers = new HttpHeaders({ 'deliveryId': deliveryId, 'guia': guia });
    console.log(headers)
    return this.http.post<ApiResponse>(`${environment.baseService}${'/package/addPackagesInDelivery'}`, null,
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

  addPackagesCar(guia: any, deliveryId: any): Observable<ApiResponse> {
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

  updatePackageDex(packageId: any, catDexId: any): Observable<ApiResponse> {
    let headers = new HttpHeaders({ 'packageId': packageId, 'catDexId': catDexId });
    return this.http.post<ApiResponse>(`${environment.baseService}${'/package/changeDexPackage'}`, null,
      { headers }
    );
  }

  createPackageWithConsolidado(packageId: any, description: any, data: any): Observable<ApiResponse> {
    let headers = new HttpHeaders({ 'packageId': packageId, 'description': description });
    return this.http.post<ApiResponse>(`${environment.baseService}${'/package/createPackageWithConsolidado'}`, data,
      { headers }
    );
  }

  SentDataExelCost(data: any, incomingPackageId: any): Observable<ApiResponse> {//Trae la nomina actual
    let headers = new HttpHeaders({ 'incomingPackageId': incomingPackageId });
    return this.http.post<ApiResponse>(`${environment.baseService}${'/package/createCostLoad'}`, data,
      { headers });
  }

  MatchingPackageCost(incomingPackageId: any): Observable<ApiResponse> {
    let headers = new HttpHeaders({ 'incomingPackageId': incomingPackageId });
    return this.http.post<ApiResponse>(`${environment.baseService}${'/package/matchCost'}`, null,
      { headers }
    );
  }

  updatePackageWithConsolidado(packageId: any, description: any, data: any): Observable<ApiResponse> {
    let headers = new HttpHeaders({ 'packageId': packageId, 'description': description });
    return this.http.patch<ApiResponse>(`${environment.baseService}${'/package/createPackageWithConsolidado'}`, data,
      { headers }
    );
  }

  DeletePackage(packageId: any): Observable<ApiResponse> {
    let headers = new HttpHeaders({ 'packageId': packageId });
    return this.http.patch<ApiResponse>(`${environment.baseService}${'/package/softdelete'}`, null,
      { headers }
    );
  }

  DeletePackageByDelivery(packageId: any, deliveryId : any, description: any): Observable<ApiResponse> {
    let headers = new HttpHeaders({ 'packageId': packageId, 'deliveryId': deliveryId, 'description': description });
    return this.http.patch<ApiResponse>(`${environment.baseService}${'/package/softdeleteDelivery'}`, null,
      { headers }
    );
  }


}
