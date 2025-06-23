import { Component, OnInit } from '@angular/core';
import { ApiResponse } from 'src/app/models/ApiResponse';
import { RHService } from 'src/app/services/rh.service';
import { Cargamento, Persona } from 'src/app/shared/interfaces/utils';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';
import { PakageService } from 'src/app/services/pakage.service';



@Component({
  selector: 'app-pakage-incoming',
  templateUrl: './pakage-incoming.component.html',
  styleUrls: ['./pakage-incoming.component.css']
})
export class PakageIncomingComponent implements OnInit {
  searchTerm: string = '';
  data: Cargamento[] = []; // Ya no usamos la interfaz Persona
  PackageOrgId: number = 1; // ID de la organización de paquetería, puedes cambiarlo según sea necesario

  constructor(private rh: RHService,
    private router: Router,
    private pakage: PakageService
  ) { }

  ngOnInit(): void {
    this.getDatos();
  }

  getDatos() {
    // 👇 Puedes descomentar esto cuando el endpoint esté funcionando

    const desdeFormatted = new Date('2025-06-01').toISOString().split('T')[0];
    const hastaFormatted = new Date('2025-06-20').toISOString().split('T')[0];

    this.pakage.getCargaById(this.PackageOrgId, desdeFormatted, hastaFormatted, 0, 50).subscribe(
      (response: ApiResponse) => {
        this.data = response.data;
      },
      (error) => {
        console.error('Ocurrió un error', error);
      }
    );


    // 👉 Datos ficticios por mientras
    // this.data = [
    //   {
    //     id: 1,
    //     titulo: 'Cargamento 1',
    //     fecha: '2025-06-17',
    //     entregados: 80,
    //     faltantes: 20
    //   },
    //   {
    //     id: 2,
    //     titulo: 'Cargamento 2',
    //     fecha: '2025-06-16',
    //     entregados: 45,
    //     faltantes: 55
    //   },
    //   {
    //     id: 3,
    //     titulo: 'Cargamento 3',
    //     fecha: '2025-06-15',
    //     entregados: 20,
    //     faltantes: 80
    //   }
    // ];
  }

  porcentaje(item: Cargamento): number {
    const total = item.barra;
    return total;
  }

  infocard(id: number) {

    this.router.navigate(['/pages/Paqueteria/Registro-seguimiento']);
  }

  crearCargamento() {
    Swal.fire({
      title: '¿Está seguro?',
      text: 'Se creará un nuevo cargamento.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, crear',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        const pakageOrgId = 1; // o el que corresponda
        const description = 'Cargamento generado desde Home'; // o algo dinámico

        this.pakage.createIncoming(pakageOrgId, description).subscribe({
          next: (res) => {
            Swal.fire('¡Cargamento creado!', '', 'success').then(() => {
              this.router.navigate(['/pages/Paqueteria/Registro-seguimiento']);
            });
          },
          error: (err) => {
            console.error('Error al crear cargamento:', err);
            Swal.fire('Error al crear cargamento', err.error?.message || '', 'error');
          }
        });
      }
    });
  }

}
