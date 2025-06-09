import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, CanLoad, Route, RouterStateSnapshot, UrlSegment, UrlTree, Router } from '@angular/router';
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
    state: RouterStateSnapshot):
    Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
      const token = localStorage.getItem('token');
      const rolId = localStorage.getItem('rolId');
      const extras = localStorage.getItem('extras');


      if (!token || !rolId) {
        console.error('El token o rolId no están definidos.');
        this.router.navigate(['/login']);
        return false;
      }

      // Obtener la ruta completa solicitada
      const requestedPath = state.url.slice(1); // Remueve el primer '/'

      return new Promise<boolean>((resolve) => {
        this.authService.getModulesByRole(rolId, extras).subscribe(
          (response: ApiResponse) => {
            if (response.success) {
              const allowedModules: Module[] = response.data;

              // Verificar si el módulo solicitado coincide con algún módulo permitido
              const hasAccess = allowedModules.some((module: Module) => {
                return requestedPath === module.config;
              });

              if (hasAccess) {
                resolve(true);
              } else {
                console.warn('Acceso denegado a la ruta:', requestedPath);
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
    segments: UrlSegment[]): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    return true;
  }
}
