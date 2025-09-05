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
    return this.http.get<ApiResponse>(`${environment.baseService}${'/package/incoming/byPackageOrgId'}`, { headers });
  }

  getAllPackages(headers: HttpHeaders): Observable<ApiResponse> {
    return this.http.get<ApiResponse>(`${environment.baseService}${'/package/getAllPackages'}`, { headers });
  }


  getDeliveriesCar(page: any, size: any): Observable<ApiResponse> {
    let headers = new HttpHeaders({ 'page': page, 'size': size });
    return this.http.get<ApiResponse>(`${environment.baseService}${'/package/delivery/informationCars'}`, { headers });
  }

  getPackagesDeliveryById(deliveryId: any, page: any, size: any): Observable<ApiResponse> {
    let headers = new HttpHeaders({ 'deliveryId': deliveryId, 'page': page, 'size': size });
    return this.http.get<ApiResponse>(`${environment.baseService}${'/package/delivery'}`, { headers });
  }

  searchPackage(guia: any): Observable<ApiResponse> {
    let headers = new HttpHeaders({ 'guia': guia });
    return this.http.get<ApiResponse>(`${environment.baseService}${'/package/searchPackage'}`, { headers });
  }

  getDeliveryByEmployeeId(): Observable<ApiResponse> {
    return this.http.get<ApiResponse>(`${environment.baseService}${'/package/delivery/informationByEmployeeId'}`);
  }

  getPackageByCarga(incomingPackageId: any, page: any, size: any, isCost: any): Observable<ApiResponse> {
    let headers = new HttpHeaders({ 'incomingPackageId': incomingPackageId, 'page': page, 'size': size, 'isCost': isCost });
    return this.http.get<ApiResponse>(`${environment.baseService}${'/package/incoming'}`, { headers });
  }

  getGuiasByIncomingPackage(incomingPackageId: any): Observable<ApiResponse> {
    let headers = new HttpHeaders({ 'incomingPackageId': incomingPackageId });
    return this.http.get<ApiResponse>(`${environment.baseService}${'/package/incoming/guiasList'}`, { headers });
  }


  getPackageByDelivery(deliveryId: any, page: any, size: any, isCost: any): Observable<ApiResponse> {
    let headers = new HttpHeaders({ 'deliveryId': deliveryId, 'page': page, 'size': size, 'isCost': isCost });
    return this.http.get<ApiResponse>(`${environment.baseService}${'/package/delivery'}`, { headers });
  }

  getPDex(): Observable<ApiResponse> {
    return this.http.get<ApiResponse>(`${environment.baseService}${'/package/getDex'}`);
  }

  searchPackageDelivery(guia: any, deliveryId: any): Observable<ApiResponse> {
    let headers = new HttpHeaders({ 'guia': guia, 'deliveryId': deliveryId });
    return this.http.get<ApiResponse>(`${environment.baseService}${'/package/delivery/byPackage'}`, { headers });
  }

  getConfigPackageOrg(headers: HttpHeaders): Observable<ApiResponse> {
    return this.http.get<ApiResponse>(`${environment.baseService}${'/package/getConfigPackageOrg'}`, { headers });
  }

  getCatPakageOrg(): Observable<ApiResponse> {
    return this.http.get<ApiResponse>(`${environment.baseService}${'/package/getCatPackageOrg'}`);
  }

  getCatEmpl(): Observable<ApiResponse> {
    return this.http.get<ApiResponse>(`${environment.baseService}${'/users'}`);
  }

  getHistoryByPakage(packageId: any): Observable<ApiResponse> {
    let headers = new HttpHeaders({ 'packageId': packageId });
    return this.http.get<ApiResponse>(`${environment.baseService}${'/package/packageHistory'}`, { headers });
  }

  SentListPackage(data: any, incomingPackageId: any): Observable<ApiResponse> {//envio de lista de paquetes
    let headers = new HttpHeaders({ 'incomingPackageId': incomingPackageId });
    return this.http.post<ApiResponse>(`${environment.baseService}${'/package/incoming/packagesList'}`, data,
      { headers });
  }

  SentListPackageDelivery(data: any, deliveryId: any, packageOrgId: any): Observable<ApiResponse> {//envio de lista de paquetes
    let headers = new HttpHeaders({ 'deliveryId': deliveryId, 'packageOrgId': packageOrgId });
    return this.http.post<ApiResponse>(`${environment.baseService}${'/package/delivery/packagesList'}`, data,
      { headers });
  }

  sendExcelDelivery(file: File, incomingPackageId: number): Observable<ApiResponse> {
    const formData = new FormData();
    formData.append('file', file, file.name); // @RequestParam MultipartFile file

    const headers = new HttpHeaders().set('incomingPackageId', String(incomingPackageId));
    return this.http.post<ApiResponse>(
      `${environment.baseService}/package/incoming/load/delivery`,
      formData,
      { headers }
    );
  }


  paquetesEscaneados(guia: any, incomingPackageId: any): Observable<ApiResponse> {//Trae la nomina actual
    let headers = new HttpHeaders({ 'incomingPackageId': incomingPackageId, 'guia': guia, });
    return this.http.post<ApiResponse>(`${environment.baseService}${'/package/incoming/package'}`, null,
      { headers });
  }

  addPackagesInDelivery(guia: any, deliveryId: any): Observable<ApiResponse> {//Trae la nomina actual
    let headers = new HttpHeaders({ 'deliveryId': deliveryId, 'guia': guia });
    console.log(headers)
    return this.http.post<ApiResponse>(`${environment.baseService}${'/package/delivery/package'}`, null,
      { headers });
  }


  createIncoming(pakageOrgId: any, description: any, isWithPackages: boolean): Observable<ApiResponse> {
    let headers = new HttpHeaders({ 'description': description, 'pakageOrgId': pakageOrgId, 'isWithPackages': isWithPackages.toString() });
    return this.http.post<ApiResponse>(`${environment.baseService}${'/package/incoming'}`, null,
      { headers }
    );
  }


  MatchingPackage(incomingPackageId: any): Observable<ApiResponse> {
    let headers = new HttpHeaders({ 'incomingPackageId': incomingPackageId });
    return this.http.post<ApiResponse>(`${environment.baseService}${'/package/incoming/match/delivery'}`, null,
      { headers }
    );
  }

  createDeliveryCar(data: any): Observable<ApiResponse> {
    return this.http.post<ApiResponse>(`${environment.baseService}${'/package/delivery'}`, data,
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
    return this.http.post<ApiResponse>(`${environment.baseService}${'/package/delivery/changeStatus'}`, null,
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

  sendExcelCost(file: File, incomingPackageId: number): Observable<ApiResponse> {
    const formData = new FormData();
    formData.append('file', file, file.name); // @RequestParam MultipartFile file

    const headers = new HttpHeaders().set('incomingPackageId', String(incomingPackageId));
    return this.http.post<ApiResponse>(
      `${environment.baseService}/package/incoming/load/cost`,
      formData,
      { headers }
    );
  }

  MatchingPackageCost(incomingPackageId: any): Observable<ApiResponse> {
    let headers = new HttpHeaders({ 'incomingPackageId': incomingPackageId });
    return this.http.post<ApiResponse>(`${environment.baseService}${'/package/incoming/match/cost'}`, null,
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

  DeletePackageByDelivery(packageId: any, deliveryId: any, description: any): Observable<ApiResponse> {
    let headers = new HttpHeaders({ 'packageId': packageId, 'deliveryId': deliveryId, 'description': description });
    return this.http.patch<ApiResponse>(`${environment.baseService}${'/package/delivery/softdelete'}`, null,
      { headers }
    );
  }


}
