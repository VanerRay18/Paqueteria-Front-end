import { Injectable } from '@angular/core';
import { Observable, of, tap } from 'rxjs';
import { User } from '../shared/interfaces/usuario.model'; // Importa el modelo de usuario
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ApiResponse } from '../models/ApiResponse';
import { environment } from 'src/environments/enviroment';

export interface AuthResponse {
  success: boolean;
  message: string;
  data: {
    roleId: number; // Asegúrate de que este tipo coincide con la respuesta
    token: string; // Aquí debes asegurarte de que estás recibiendo el token
  };
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private loggedIn: boolean = false;  // Estado de logueo del usuario
  private userRole: string | null = null;  // Almacena el nombre del rol del usuario
  private userModules: number[] = [];  // Almacena los módulos del usuario

  constructor(
    private http:HttpClient
  ) {}

  authLogg(data: any): Observable<any> {
    return this.http.post<any>(`${environment.baseService}${'/login'}`, data, {observe:'response'})
  }

  getToken(): string | null {
    return localStorage.getItem('jwt'); // Obtener el token del localStorage
  }

  // authLogg(token: string): Observable<any> {
  //   let headers = new HttpHeaders({Authorization:token})
  //   console.log(`${environment.baseService}${'/login'}`)
  //   return this.http.post<any>(`${environment.baseService}${'/login'}`, {headers});
  // }

  getModulesByRole(): Observable<ApiResponse> {
    return this.http.get<ApiResponse>(`${environment.baseService}${'/users/moduleByUser'}`,
    );
  }


  getModules(): Observable<ApiResponse> {
    return this.http.get<any>(`${environment.baseService}${'/modules'}`);
  }

  getRoles(): Observable<ApiResponse> {
    return this.http.get<any>(`${environment.baseService}${'/roles'}`);
  }


  // Método para verificar si el rol coincide con los permisos requeridos


    getNotifications(userId: any): Observable<ApiResponse> {
      let headers = new HttpHeaders({'userId': userId})
      return this.http.get<ApiResponse>(`${environment.baseService}${'/notifications'}`,
        {headers}
      );
    }

    changeStatus(notificationId: any, status: any): Observable<ApiResponse> {//Cambia el estado de la nomina
      let headers = new HttpHeaders({'notificationId': notificationId, 'status': status})
      return this.http.patch<ApiResponse>(`${environment.baseService}${'/notifications/status'}`,null,
        {headers}
      );
    }


}
