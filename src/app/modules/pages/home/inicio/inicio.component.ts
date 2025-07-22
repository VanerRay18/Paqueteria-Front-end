import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ApiResponse } from 'src/app/models/ApiResponse';
import { FileTransferService } from 'src/app/services/file-transfer.service';
import { PakageService } from 'src/app/services/pakage.service';
import { PermisosUserService } from 'src/app/services/permisos-user.service';

@Component({
  selector: 'app-inicio',
  templateUrl: './inicio.component.html',
  styleUrls: ['./inicio.component.css']
})
export class InicioComponent implements OnInit {
  empresas: any[] = [];
  isLoading: boolean = true;
  autorizar: boolean = false;

  alertas = [
    {
      dias: 3,
      mensaje: 'El paquete de la empresa "Paquetería Express" tiene 3 días sin ser entregado'
    },
    {
      dias: 5,
      mensaje: 'El contrato de Álvaro Clemente López Valderas finaliza el 19/01/2025'
    },
    {
      dias: 1,
      mensaje: 'el paquete de la empresa "Logística Rápida" le queda 1 dia para ser entregado'
    }
  ];

  constructor(private router: Router,
    private pakage: PakageService,
    private idService: FileTransferService,
    private PermisosUserService: PermisosUserService,
  ) { }

  ngOnInit(): void {
     this.filtrarPor('dia');  
    this.PermisosUserService.getPermisosSpring(this.PermisosUserService.getPermisos().ADMIN_PAQUETERIA).subscribe((response: ApiResponse) => {
      this.autorizar = response.data.auto
    });
  }

  filtrarPor(rango: 'dia' | 'semana' | 'mes') {
    const hoy = new Date();
    let desde = new Date(hoy);

    if (rango === 'semana') {
      desde.setDate(hoy.getDate() - 7);
    } else if (rango === 'mes') {
      desde.setMonth(hoy.getMonth() - 1);
    }

    const desdeStr = desde.toISOString().split('T')[0]; // yyyy-mm-dd
    const hastaStr = hoy.toISOString().split('T')[0];   // yyyy-mm-dd
    this.isLoading = true;
    this.pakage.getPaqueterias(desdeStr, hastaStr).subscribe({
      next: (res) => {
        this.empresas = res.data;
        // console.log('Empresas filtradas:', this.empresas);
        this.empresas.forEach((empresa: any) => {
          this.isLoading = false;
          empresa.nombre = empresa.name;
          empresa.faltantes = empresa.noEntregados;
          const total = empresa.entregados + empresa.faltantes;
          empresa.porcentaje = total ? (empresa.entregados / total) * 100 : 0;
        });
      },
      error: (err) => {
        console.error('Error al filtrar empresas:', err);
      }
    });
  }



  irAEmpresa(id: any) {
    // console.log('ID de la empresa:', id); // Obtiene el ID del empleado
    //this.idService.setIdTercero(id);
    this.router.navigate(['/pages/Paqueteria/Carga-paquetes/' + id]);
  }

  irAsistencias() {
    this.router.navigate(['pages/RH/Control-Asistencias']);
  }
  getPorcentaje(empresa: any): number {
    return (empresa.entregados / (empresa.entregados + empresa.faltantes)) * 100;
  }

  getColorFromPorcentaje(porcentaje: number): string {
    if (porcentaje > 70) return 'bg-green-500';
    if (porcentaje > 40) return 'bg-yellow-400';
    return 'bg-red-600';
  }

}
