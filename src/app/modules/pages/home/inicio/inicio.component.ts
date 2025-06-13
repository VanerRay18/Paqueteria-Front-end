import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

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
      ruta: '/empresa/dhl'
    },
    {
      nombre: 'J&T',
      entregados: 22,
      faltantes: 38,
      ruta: '/empresa/jyt'
    },
    {
      nombre: 'Mercado Libre',
      entregados: 40,
      faltantes: 20,
      ruta: '/empresa/mercado-libre'
    },
    {
      nombre: 'AMAZON',
      entregados: 8,
      faltantes: 52,
      ruta: '/empresa/amazon'
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

  constructor(private router: Router) {}

  ngOnInit(): void {}

  irAEmpresa(ruta: string) {
    this.router.navigate([ruta]);
  }

  irAsistencias() {
    this.router.navigate(['/asistencias']);
  }
  getPorcentaje(empresa: any): number {
  return (empresa.entregados / (empresa.entregados + empresa.faltantes)) * 100;
}

getColor(empresa: any): string {
  const porcentaje = this.getPorcentaje(empresa);
  if (porcentaje > 70) return 'bg-green-500';
  if (porcentaje > 40) return 'bg-yellow-400';
  return 'bg-red-600';
}

}
