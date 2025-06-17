import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { PakageService } from 'src/app/services/pakage.service';

@Component({
  selector: 'app-inicio',
  templateUrl: './inicio.component.html',
  styleUrls: ['./inicio.component.css']
})
export class InicioComponent {

  empresas = [
    {
      nombre: 'DHL',
      entregados: 48,
      faltantes: 12,
      porcentaje: 70,
      ruta: 'pages/Paqueteria/Registro-seguimiento'
    },
    {
      nombre: 'J&T',
      entregados: 22,
      faltantes: 38,
      porcentaje: 40,
      ruta: 'pages/Paqueteria/Registro-seguimiento'
    },
    {
      nombre: 'Mercado Libre',
      entregados: 40,
      porcentaje: 80,
      faltantes: 20,
      ruta: 'pages/Paqueteria/Registro-seguimiento'
    },
    {
      nombre: 'AMAZON',
      entregados: 8,
      faltantes: 52,
      porcentaje: 10,
      ruta: 'pages/Paqueteria/Registro-seguimiento'
    }
  ];

  alertas = [
    {
      dias: 15,
      mensaje: 'Sonia Juana González Niño ha solicitado vacaciones del 10/01/24 al 14/01/24 para Erik Randon Perez'
    },
    {
      dias: 15,
      mensaje: 'El contrato de Álvaro Clemente López Valderas finaliza el 19/01/2024'
    },
    {
      dias: 15,
      mensaje: 'Ernest Leon Hernández ha sido dado de alta'
    }
  ];

  constructor(private router: Router,
    private pakage: PakageService
  ) { }

  ngOnInit(): void {
    this.pakage.getPaqueterias().subscribe({
      next: (res) => {
        // Asignamos los datos al arreglo de empresas
        this.empresas = res.data;

        // Ajustamos nombres de propiedades según el template
        this.empresas.forEach((empresa: any) => {
          empresa.nombre    = empresa.name;
          empresa.faltantes = empresa.noEntregados;
          // Calculamos el porcentaje de entregados
          const total = empresa.entregados + empresa.faltantes;
          empresa.porcentaje = total ? (empresa.entregados / total) * 100 : 0;
        });
      },
      error: (err) => {
        console.error('Error al obtener las empresas:', err);
      }
    });
  }



  irAEmpresa(ruta: string) {
    this.router.navigate(['/pages/Paqueteria/Carga-paquetes']);
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
