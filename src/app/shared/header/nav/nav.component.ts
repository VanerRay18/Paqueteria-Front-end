import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { catchError, interval, of, pipe, startWith, Subscription, switchMap } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';
import Swal from 'sweetalert2';
import { BusquedaserlService } from 'src/app/services/busquedaserl.service';
import { ApiResponse } from 'src/app/models/ApiResponse';
import { NotificacionERP } from '../../interfaces/utils';
import { ChangeDetectorRef, NgZone } from '@angular/core';

export class TreeNode {
  moduleId!: number; // ID del módulo
  moduleName!: string; // Nombre del módulo
  description!: string; // Descripción del módulo
  config!: string; // Ruta del módulo
  parentId!: number | null; // ID del módulo padre (si es null, es un nodo padre)
  parentName!: string | null;
  icon!:string | null;
  children: TreeNode[] = []; // Lista de módulos hijos
}

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.css']
})
export class NavComponent implements OnInit, OnDestroy {
  menuItems: TreeNode[] = []; // Almacena los módulos construidos como árbol
  subs: Subscription[] = []; // Lista de suscripciones para limpiar después
  currentRoute: string = ''; // Ruta actual del navegador
  showNotifications = false; // Controla la visibilidad de las notificaciones
  notificationCount = 1; // Número de notificaciones no leídas
  notifications: NotificacionERP[] = []; // Inicializamos como un array vacío
  numNoti: any = 0 ;
  // Alternar la visibilidad de las notificaciones
  toggleNotifications() {
    this.showNotifications = !this.showNotifications;
  }
  constructor(
    private authService: AuthService,
    private router: Router,
    private BusquedaserlService: BusquedaserlService,
    private cdr: ChangeDetectorRef
  ) {     this.currentRoute = this.router.url;}
  fetchData() {
    interval(15000)
      .pipe(
        startWith(0),
        switchMap(() => {
          const userId = localStorage.getItem('userId');
          return this.authService.getNotifications(userId).pipe(
            catchError((error) => {
              console.error('Error al obtener notificaciones:', error);
              return of(null); // Retorna un valor vacío para no detener el intervalo
            })
          );
        })
      )
      .subscribe((response) => {
        if (response && response.data) {
          this.notifications = response.data.map((noti: any) => ({
            ...noti,
            timeAgo: this.calculateTimeAgo(noti.fecha),
          }));
          this.numNoti = response.message ?? 0;
          this.cdr.detectChanges();
        }
      });
  }

  calculateTimeAgo(fecha: string): string {
    const diff = Math.floor((Date.now() - new Date(fecha).getTime()) / 1000);
    if (diff < 60) return 'Hace unos segundos';
    if (diff < 3600) return `Hace ${Math.floor(diff / 60)} min`;
    if (diff < 86400) return `Hace ${Math.floor(diff / 3600)} h`;
    return `Hace ${Math.floor(diff / 86400)} días`;
  }

  ngOnInit(): void {

    this.fetchData();
    this.getCurrentRoute(); // Escucha los eventos de navegación
    this.getUserModules(); // Llama al servicio para obtener los módulos del usuario
  }
  visto(index: number, id:any): void {

     this.authService.changeStatus(id,2).subscribe(
                  response => {
                  },
                  error => {
                    Swal.fire({
                      title: 'Error',
                      text: error.error.message,
                      icon: 'error',
                      confirmButtonText: 'Aceptar'
                    });
                  }
                );

                this.numNoti = this.numNoti-1;
    this.notifications.splice(index, 1);
  }

  // Escucha los cambios en la ruta actual del navegador
  getCurrentRoute() {
    const sub = this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.currentRoute = event.url; // Actualiza la ruta actual
      }
    });
    this.subs.push(sub);
  }
  handleChildClick(route:any) {
    this.router.navigate([route]);
  }
  // Obtiene los módulos del usuario desde la API
  getUserModules() {
    const rolId = localStorage.getItem('rolId');
    const extras = localStorage.getItem('extras')
    if (rolId) {
      const sub = this.authService.getModulesByRole(rolId,extras).subscribe({
        next: (result) => {
          const modules: TreeNode[] = result.data
          .filter((item: any) => item.vista === true)
          .map((item: any) => ({
            moduleId: item.moduleId,
            moduleName: item.moduleName,
            description: item.description,
            config: item.config.trim(), // Eliminamos espacios en blanco
            parentId: item.parentId,
            icon: item.icon,
            parentName: item.parentName,
            vista: item.vista,
            children: []
          }));

          this.menuItems = this.buildTree(modules);
        },
      });
      this.subs.push(sub);
    }
  }

  // Construye el árbol de navegación a partir de los módulos obtenidos
  buildTree(data: TreeNode[]): TreeNode[] {
    const treeMap = new Map<number, TreeNode>();
    // Paso 1: Crea el mapa de módulos
    data.forEach((item: TreeNode) => {
      treeMap.set(item.moduleId, {
        ...item,
        children: [] // Inicializa el array de hijos
      });
    });

    // Paso 2: Asocia los módulos hijos a sus padres
    data.forEach((item: TreeNode) => {
      if (item.parentId !== null) {
        const parent = treeMap.get(item.parentId);
        if (parent) {
          parent.children.push(treeMap.get(item.moduleId)!);
        }
      }
    });

    // Paso 3: Obtiene los nodos raíz (módulos sin padre)
    const roots: TreeNode[] = [];
    treeMap.forEach((node) => {
      if (node.parentId === null) {
        roots.push(node);
      }
    });
    return roots; // Devuelve la estructura final del árbol
  }

  ngOnDestroy(): void {
    this.BusquedaserlService.clearSrlEmp()
    this.subs.forEach(sub => sub.unsubscribe());
  }
}
