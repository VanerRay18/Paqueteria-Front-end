import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable()
export class TokenInterceptor implements HttpInterceptor {

  constructor() {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
     // Obtener el token del localStorage
     const token = localStorage.getItem('token');

     // Si hay un token, clona la solicitud y agrega el token en el header Authorization
     if (token) {
       const cloned = req.clone({
         setHeaders: {
           Authorization: `Bearer ${token}`
         }
       });
       return next.handle(cloned);
     }

     // Si no hay token, simplemente pasa la solicitud original
     return next.handle(req);
  }
}
