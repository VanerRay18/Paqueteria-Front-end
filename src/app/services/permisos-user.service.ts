import { Injectable } from '@angular/core';
import { ApiResponse } from '../models/ApiResponse';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/enviroment';

@Injectable({
  providedIn: 'root'
})
export class PermisosUserService {

  constructor(private http:HttpClient) { }
  permisos: any;

  save(permisos:any):any{
    localStorage.setItem('permisos', JSON.stringify(permisos))
  }
  getPermisos(): any {
    const permisosString = localStorage.getItem('permisos');
   
    if (permisosString) {
        try {
            this.permisos = JSON.parse(permisosString);
            return this.permisos;
        } catch (error) {
            console.error("Error al parsear JSON de permisos:", error);
            return null;
        }
    } else {
        console.log("No se encontraron permisos en localStorage");
        return null;
    }
}

  edit(): boolean {
    const editarValue = localStorage.getItem('editar');
    return editarValue !== null ? editarValue === 'true' : true;
  }

  deleted(): boolean {
    const eliminarValue = localStorage.getItem('eliminar');
    return eliminarValue !== null ? eliminarValue === 'true' : true;
  }
  
  add(): boolean {
    const agregarValue = localStorage.getItem('agregar');
    return agregarValue !== null ? agregarValue === 'true' : true;
  }

  getPermisosSpring(permisoId: number): Observable<ApiResponse> {//Historial actual de licencias
    let headers = new HttpHeaders({'permisoId': permisoId})
    return this.http.get<ApiResponse>(`${environment.baseService}${'/user/permisosById'}`,
      {headers}
    );
  }
}

