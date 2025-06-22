import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { catchError, interval, of, Subscription, startWith } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';
import Swal from 'sweetalert2';
import { BusquedaserlService } from 'src/app/services/busquedaserl.service';
import { ApiResponse } from 'src/app/models/ApiResponse';
import { NotificacionERP } from '../../interfaces/utils';
import { formatDate } from '@angular/common';

export class TreeNode {
  moduleId!: number;
  moduleName!: string;
  description!: string;
  config!: string;
  parentId!: number | null;
  parentName!: string | null;
  icon!: string | null;
  children: TreeNode[] = [];
}

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.css']
})
export class NavComponent implements OnInit, OnDestroy {
  menuItems: TreeNode[] = [];
  subs: Subscription[] = [];
  currentRoute: string = '';
  showNotifications = false;
  notificationCount = 1;
  notifications: NotificacionERP[] = [];
  filteredNotifications: NotificacionERP[] = [];
  numNoti: any = 0;
  activeFilter: 'day' | 'week' | 'month' = 'week';

  constructor(
    private authService: AuthService,
    private router: Router,
    private BusquedaserlService: BusquedaserlService,
    private cdr: ChangeDetectorRef
  ) {
    this.currentRoute = this.router.url;
  }

  toggleNotifications() {
      this.showNotifications = !this.showNotifications;

  if (this.showNotifications) {
    document.body.style.overflow = 'hidden'; // ❌ bloquea scroll del body
    this.applyNotificationFilter();
  } else {
    document.body.style.overflow = ''; // ✅ restaura el scroll
  }
  }

  ngOnInit(): void {
    this.getCurrentRoute();
    this.getUserModules();
    this.setupAutoRefresh();
  }

setupAutoRefresh() {
  const sub = interval(20000)
    .pipe(startWith(0))
    .subscribe(() => {
      this.applyNotificationFilter();
    });

  this.subs.push(sub);
}


  applyNotificationFilter() {
    const now = new Date();
    let from = new Date();

    switch (this.activeFilter) {
      case 'day':
        // hoy
        break;
      case 'week':
        from.setDate(now.getDate() - 7);
        break;
      case 'month':
        from.setMonth(now.getMonth() - 1);
        break;
    }

    const fromDate = formatDate(from, 'yyyy-MM-dd', 'en-US');
    const toDate = formatDate(now, 'yyyy-MM-dd', 'en-US');

    this.authService.getNotifications(fromDate, toDate).subscribe(
      (response: any) => {
        this.notifications = response?.data?.map((noti: any) => ({
          ...noti,
          timeAgo: this.calculateTimeAgo(noti.fecha),
        })) || [];

        this.filteredNotifications = this.notifications;
        this.numNoti = response?.message ?? 0;
        this.cdr.detectChanges();
      },
      (error) => {
        console.error('Error al obtener notificaciones:', error);
      }
    );
  }

  filterNotifications(range: 'day' | 'week' | 'month') {
    this.activeFilter = range;
    this.applyNotificationFilter();
  }

  calculateTimeAgo(fecha: string): string {
    const diff = Math.floor((Date.now() - new Date(fecha).getTime()) / 1000);
    if (diff < 60) return 'Hace unos segundos';
    if (diff < 3600) return `Hace ${Math.floor(diff / 60)} min`;
    if (diff < 86400) return `Hace ${Math.floor(diff / 3600)} h`;
    return `Hace ${Math.floor(diff / 86400)} días`;
  }

  visto(index: number, id: any): void {
    this.authService.changeStatus(id, 2).subscribe(
      () => {},
      (error) => {
        Swal.fire({
          title: 'Error',
          text: error.error.message,
          icon: 'error',
          confirmButtonText: 'Aceptar'
        });
      }
    );

    this.numNoti = this.numNoti - 1;
    this.filteredNotifications.splice(index, 1);
  }

  getCurrentRoute() {
    const sub = this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.currentRoute = event.url;
      }
    });
    this.subs.push(sub);
  }

  handleChildClick(route: any) {
    this.router.navigate([route]);
  }

  getUserModules() {
    const rolId = localStorage.getItem('rolId');
    if (rolId) {
      const sub = this.authService.getModulesByRole().subscribe({
        next: (result) => {
          const modules: TreeNode[] = result.data
            .filter((item: any) => item.vista === true)
            .map((item: any) => ({
              moduleId: item.moduleid,
              moduleName: item.modulename,
              description: item.description,
              config: typeof item.config === 'string' ? item.config.trim() : '',
              parentId: item.parentid,
              icon: item.icon,
              parentName: item.parentname,
              children: []
            }));

          this.menuItems = this.buildTree(modules);
        },
      });
      this.subs.push(sub);
    }
  }

  buildTree(data: TreeNode[]): TreeNode[] {
    const treeMap = new Map<number, TreeNode>();
    data.forEach((item: TreeNode) => {
      treeMap.set(item.moduleId, {
        ...item,
        children: []
      });
    });

    data.forEach((item: TreeNode) => {
      if (item.parentId !== null) {
        const parent = treeMap.get(item.parentId);
        if (parent) {
          parent.children.push(treeMap.get(item.moduleId)!);
        }
      }
    });

    const roots: TreeNode[] = [];
    treeMap.forEach((node) => {
      if (node.parentId === null) {
        roots.push(node);
      }
    });

    return roots;
  }

  ngOnDestroy(): void {
    this.BusquedaserlService.clearSrlEmp();
    this.subs.forEach(sub => sub.unsubscribe());
  }
}
