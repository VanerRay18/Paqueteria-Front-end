import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  CanLoad,
  Route,
  RouterStateSnapshot,
  UrlSegment,
  UrlTree,
  Router
} from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';
import { Module } from 'src/app/shared/interfaces/utils';
import { ApiResponse } from 'src/app/models/ApiResponse';

@Injectable({
  providedIn: 'root'
})
export class LoggedGuard implements CanActivate, CanLoad {
  constructor(
    private router: Router,
    private authService: AuthService,
  ) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    const token = localStorage.getItem('token');
    const rolId = localStorage.getItem('rolId');

    if (!token || !rolId) {
      console.error('El token o rolId no están definidos.');
      this.router.navigate(['/login']);
      return false;
    }

    // Obtener la ruta solicitada sin el primer '/'
    const requestedPath = state.url.slice(1);
    const pathSegments = requestedPath.split('/');

    // Si el último segmento es un número, lo eliminamos (se asume que es un ID)
    if (!isNaN(Number(pathSegments[pathSegments.length - 1]))) {
      pathSegments.pop();
    }

    const normalizedPath = pathSegments.join('/'); // Ruta sin ID dinámico

    return new Promise<boolean>((resolve) => {
      this.authService.getModulesByRole().subscribe(
        (response: ApiResponse) => {
          if (response.success) {
            const allowedModules: Module[] = response.data;

            const hasAccess = allowedModules.some((module: Module) => {
              return normalizedPath === module.config;
            });

            if (hasAccess) {
              resolve(true);
            } else {
              console.warn('Acceso denegado a la ruta:', normalizedPath);
              this.router.navigate(['/login']);
              resolve(false);
            }
          } else {
            console.error('Error al obtener los módulos:', response.message);
            this.router.navigate(['/login']);
            resolve(false);
          }
        },
        (error) => {
          console.error('Error en la solicitud:', error);
          this.router.navigate(['/login']);
          resolve(false);
        }
      );
    });
  }

  canLoad(
    route: Route,
    segments: UrlSegment[]
  ): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    return true;
  }
}
