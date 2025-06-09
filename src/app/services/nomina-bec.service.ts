import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiResponse } from 'src/app/models/ApiResponse';
import { environment } from 'src/environments/enviroment';
import { SendEmailDTO } from '../shared/interfaces/utils'; // Ajusta la ruta de SendEmailDTO según tu estructura



@Injectable({
  providedIn: 'root'
})
export class NominaBecService {

  constructor(
    private http:HttpClient
  ) { }



  getNomina(): Observable<ApiResponse> {//Trae la nomina actual
    return this.http.get<ApiResponse>(`${environment.baseService}${'/nomina/nominaActual'}`);
  }

  getInformationCalculation(nominaId: string): Observable<ApiResponse> {//Trae los calculos del empleado
    let headers = new HttpHeaders({'nominaId': (nominaId == null) || (nominaId.length <0) ?0:nominaId})
    return this.http.get<ApiResponse>(`${environment.baseService}${'/nomina/users'}`,
      {headers}
    );

  }

  getClaves(nominaId: any): Observable<ApiResponse> {//Trae las claves bancarias del empleado
    let headers = new HttpHeaders({'nominaId': nominaId})
    return this.http.get<ApiResponse>(`${environment.baseService}${'/nomina/clabes'}`,
      {headers}
    );
  }

  getCatalogos(): Observable<ApiResponse> {//Trae la nomina actual
    return this.http.get<ApiResponse>(`${environment.baseService}${'/nomina/catalogo'}`);
  }

  DeleteCatalog(catalogoId: any): Observable<ApiResponse> {//Trae el anexo 5
    let headers = new HttpHeaders({'catalogoId': catalogoId})
    console.log(catalogoId)
    return this.http.patch<ApiResponse>(`${environment.baseService}${'/nomina/softdeleteCatalogo'}`,null,
      {headers}
    );
  }

  getHistory(): Observable<ApiResponse> {//Trae la nomina actual
    return this.http.get<ApiResponse>(`${environment.baseService}${'/nomina/nominaHistorial'}`);
  }

  getBecarios(): Observable<ApiResponse> {//Trae la nomina actual
    return this.http.get<ApiResponse>(`${environment.baseService}${'/nomina/becarios'}`);
  }

  getPlazaBecarios(srl_emp: any): Observable<ApiResponse> {//Trae las claves bancarias del empleado
    let headers = new HttpHeaders({'srl_emp': srl_emp})
    return this.http.get<ApiResponse>(`${environment.baseService}${'/nomina/plazaBecario'}`,
      {headers}
    );
  }

  getPreAnexo6(nominaId: any, ordinaria: Boolean): Observable<ApiResponse> {//Trae el anexo 5
    let headers = new HttpHeaders({'nominaId': nominaId, 'ordinaria': ordinaria.toString()})
    return this.http.get<ApiResponse>(`${environment.baseService}${'/nomina/preAnexo06'}`,
      {headers}
    );
  }


  getPreAnexo5(nominaId: any, ordinaria: Boolean): Observable<ApiResponse> {//Trae el anexo 5
    let headers = new HttpHeaders({'nominaId': nominaId, 'ordinaria': ordinaria.toString()})
    return this.http.get<ApiResponse>(`${environment.baseService}${'/nomina/preAnexo05'}`,
      {headers}
    );
  }

  getReportes(nominaId: any): Observable<ApiResponse> {//Trae las claves bancarias del empleado
    let headers = new HttpHeaders({'nominaId': nominaId})
    return this.http.get<ApiResponse>(`${environment.baseService}${'/nomina/reporte'}`,
      {headers}
    );
  }


  getHistoryById(nominaId: any): Observable<ApiResponse> {//Trae las claves bancarias del empleado
    let headers = new HttpHeaders({'nominaId': nominaId})
    return this.http.get<ApiResponse>(`${environment.baseService}${'/nomina/nominaHistorialById'}`,
      {headers}
    );
  }

  NewCatalogos(data:any): Observable<ApiResponse> {//Trae la nomina actual
    return this.http.post<ApiResponse>(`${environment.baseService}${'/nomina/catalogo'}`,data);
  }

  editCatalogos(data:any, catalogoId:any): Observable<ApiResponse> {//Trae la nomina actual
    let headers = new HttpHeaders({'catalogoId': catalogoId})
    return this.http.patch<ApiResponse>(`${environment.baseService}${'/nomina/catalogo'}`,data,
      {headers}
    );
  }

  saveNomina(data:any): Observable<ApiResponse> {//Guarda la nomina
    return this.http.post<ApiResponse>(`${environment.baseService}${'/nomina/saveNomina'}`,data);
  }


  changeClave(clabes:any): Observable<ApiResponse> {//Cambia el tipode pago del empleado
    return this.http.post<ApiResponse>(`${environment.baseService}${'/nomina/changeClabe'}`,clabes);
  }

  changeStatus(nominaId: any, status: any): Observable<ApiResponse> {//Cambia el estado de la nomina
    let headers = new HttpHeaders({'nominaId': nominaId, 'status': status})
    return this.http.post<ApiResponse>(`${environment.baseService}${'/nomina/changeStatus'}`,null,
      {headers}
    );
  }

  getResumeExel(nominaId: any): Observable<ApiResponse> {//Trae el anexo 5
    let headers = new HttpHeaders({'nominaId': nominaId})
    return this.http.get<ApiResponse>(`${environment.baseService}${'/nomina/resume'}`,
      {headers}
    );
  }

  getAnexo05(nominaId: any, ordinaria: Boolean): Observable<ApiResponse> {//Trae el anexo 5
    let headers = new HttpHeaders({'nominaId': nominaId, 'ordinaria': ordinaria.toString()})
    return this.http.get<ApiResponse>(`${environment.baseService}${'/nomina/anexo05'}`,
      {headers}
    );
  }

  getAnexo06(nominaId: any, ordinaria: Boolean): Observable<ApiResponse> {//Trae el anexo 6
    let headers = new HttpHeaders({'nominaId': nominaId ,'ordinaria': ordinaria.toString()})
    return this.http.get<ApiResponse>(`${environment.baseService}${'/nomina/anexo06'}`,
      {headers}
    );
  }

  async getNominaId(): Promise<number> {
    try {
      const response = await this.http
        .get<ApiResponse>(`${environment.baseService}/nomina/nominaActual`)
        .toPromise();

      // Verifica si response y response.data están definidos
      return response?.data?.id ?? 0; // Retorna el ID si existe, o 0 si es undefined
    } catch (error) {
      console.error('Error al obtener los datos:', error);
      return 0; // Retorna 0 si hay un error
    }
  }


  sentNomina(data:any): Observable<ApiResponse> {//Guarda la nomina
    return this.http.post<ApiResponse>(`${environment.baseService}${'/nomina/sentNomina'}`,data);
  }

  SentArchives(sendEmailDTO: SendEmailDTO, files: File[]): Observable<ApiResponse> {
    const formData = new FormData();
    files.forEach((file) => formData.append(`file`, file, file.name));
    formData.append('sendEmailDTO', JSON.stringify(sendEmailDTO));
    // console.log(sendEmailDTO)
    // console.log(files.length)
    return this.http.post<ApiResponse>(`${environment.baseService}/email/file`, formData);
  }


  getEmails(system: any): Observable<ApiResponse> {//Trae el anexo 5
    let headers = new HttpHeaders({'system': system})
    return this.http.get<ApiResponse>(`${environment.baseService}${'/email/system'}`,
      {headers}
    );
  }

  DeleteEmails(idEmail: any): Observable<ApiResponse> {//Trae el anexo 5
    let headers = new HttpHeaders({'idEmail': idEmail})
    return this.http.patch<ApiResponse>(`${environment.baseService}${'/email/softdelete'}`,null,
      {headers}
    );
  }

  addEmail(data:any): Observable<ApiResponse> {//Cambia el tipode pago del empleado
    return this.http.post<ApiResponse>(`${environment.baseService}${'/email'}`,data);
  }

  ChangEmail(data:any, idEmail: any): Observable<ApiResponse> {//Trae el anexo 5
    let headers = new HttpHeaders({'idEmail': idEmail})
    console.log(data)
    console.log(idEmail)
    return this.http.patch<ApiResponse>(`${environment.baseService}${'/email'}`,data,
      {headers}
    );
  }

  getEmailForInput(system: any): Observable<ApiResponse> {//Trae el anexo 5
    let headers = new HttpHeaders({'system': system})
    return this.http.get<ApiResponse>(`${environment.baseService}${'/email/input'}`,
      {headers}
    );
  }


  downloadZip(nominaId: any): Observable<HttpResponse<Blob>> {
    const headers = new HttpHeaders({ 'nominaId': nominaId });

    return this.http.get(`${environment.baseService}/nomina/descargar-zip`, {
      headers: headers,
      responseType: 'blob',
      observe: 'response'
    });
  }


getPDFEnvioN(nominaId: any): Observable<ApiResponse> {//Trae el anexo 5
  let headers = new HttpHeaders({'nominaId': nominaId})
  return this.http.get<ApiResponse>(`${environment.baseService}${'/nomina/envioNomina'}`,
    {headers}
  );
}

getPDFReciboN(nominaId: any): Observable<ApiResponse> {//Trae el anexo 5
  let headers = new HttpHeaders({'nominaId': nominaId})
  return this.http.get<ApiResponse>(`${environment.baseService}${'/nomina/reciboNomina'}`,
    {headers}
  );
}

SpecialNomina( files: File[]): Observable<ApiResponse> {
  const formData = new FormData();
  files.forEach((file) => formData.append(`file`, file, file.name));
  return this.http.post<ApiResponse>(`${environment.baseService}/nomina/specialNomina`, formData);
}

skipnomina(): Observable<ApiResponse> {//Salta la nomina actual
  return this.http.post<ApiResponse>(`${environment.baseService}${'/nomina/saltarNomina'}`,null);
}



}
