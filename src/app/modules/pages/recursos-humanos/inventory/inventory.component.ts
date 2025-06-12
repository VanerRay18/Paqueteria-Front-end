import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ApiResponse } from 'src/app/models/ApiResponse';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';
import { FileTransferService } from 'src/app/services/file-transfer.service';
import { FormBuilder, FormGroup } from '@angular/forms';
import { RHService } from 'src/app/services/rh.service';

@Component({
  selector: 'app-inventory',
  templateUrl: './inventory.component.html',
  styleUrls: ['./inventory.component.css']
})
export class InventoryComponent {

 searchTerm: string = '';
  headersB = ['Placa','Modelo','Marca','Submarca','No. serie', 'Compañia de seguros', 'Vigencia', 'Verificacion', 'Status','Acciones'];
  displayedColumnsB = ['placa','modelo ','marca','submarca','vin', 'cat_job_id', 'cat_employment_id', 'phone', 'active'];
  dataB:any[] = [];
  headersC = ['Articulo','Descripcion','Categoria','Cantidad','Status','Informacion', 'Acciones'];
  displayedColumnsC = ['Articulo','Descripcion','Categoria','Cantidad','active'];
  dataC:any[] = [];
  isLoading = false;
  info: any;
  arrayUserRecibido: any;
  activeTab: string = 'base';
  tabs = [
    { id: 'base', title: 'Vehiculos', icon: 'fa-solid fa-file-csv' },
    { id: 'contrato', title: 'Materiales', icon: 'fa-solid fa-file-csv' }
  ];

  constructor(
    private router: Router,
    private cdr: ChangeDetectorRef,
    private fb: FormBuilder,
    private rh: RHService
  ) {
  }

  ngOnInit(): void {
    this.getData();
  }

  onDelete(licenciaId: any) {

  }

getData() {
  this.rh.getEmployees().subscribe((response: ApiResponse) => {
console.log('Datos obtenidos:', response.data);
   this.dataB = response.data.individual;
   this.dataC = response.data.honorarios;
    // console.log('Datos obtenidos:', this.data);
  },
    (error) => {
      // console.error('Error al obtener los datos:', error);
      console.error('Ocurrio un error', error);
    });

  this.dataB = [
    {
      nombre: 'Juan',
      primer_apellido: 'Pérez',
      segundo_apellido: 'López',
      rfc: 'PEPJ800101HDF',
      curp: 'PEPJ800101HDFRZN00',
      tipo_contratacion: 'Por contrato',
      puesto: 'Repartidor',
      telefono: '7712345678',
      activo: true
    },
    {
      nombre: 'María',
      primer_apellido: 'Gómez',
      segundo_apellido: 'Hernández',
      rfc: 'GOHM900202MDF',
      curp: 'GOHM900202MDFRLR00',
      tipo_contratacion: 'Por contrato',
      puesto: 'Repartidor',
      telefono: '7712345678',
      activo: true
    }
  ];

  this.dataC = [
    {
      nombre: 'Carlos',
      primer_apellido: 'Ramírez',
      segundo_apellido: 'Nava',
      rfc: 'RANC850505HDF',
      curp: 'RANC850505HDFMRV00',
      tipo_contratacion: 'Honorarios',
      puesto: 'Repartidor',
      telefono: '7712345678',
      activo: true
    },
    {
      nombre: 'Laura',
      primer_apellido: 'Martínez',
      segundo_apellido: 'Soto',
      rfc: 'MASL920304MDF',
      curp: 'MASL920304MDFRRL00',
      tipo_contratacion: 'Honorarios',
      puesto: 'Repartidor',
      telefono: '7712345678',
      activo: true
    }
  ];
}

showDetails(row: any) {

  const detalles = row.detalles;

  let tableHtml = `
    <table class="table table-bordered">
      <thead>
        <tr>
          <th>Pago</th>
          <th>Tipo</th>
          <th>Plaza</th>
          <th>Quincenas</th>
          <th>Total</th>
          <th>Retención</th>
          <th>Líquido</th>
        </tr>
      </thead>
      <tbody>
        ${detalles.map((item: any) => `
          <tr>
            <td>${item.pago || 'N/A'}</td>
            <td>${item.type || 'N/A'}</td>
            <td>${item.plaza || 'N/A'}</td>
            <td>${item.quincenas || 'N/A'}</td>
            <td>${item.import || 'N/A'}</td>
            <td>${item.retention || 'N/A'}</td>
            <td>${item.liquid || 'N/A'}</td>
          </tr>
        `).join('')}
      </tbody>
    </table>`;

  Swal.fire({
    title: 'Detalles del Pago',
    html: tableHtml,
    width: '1000px',
    confirmButtonText: 'Cerrar',
    confirmButtonColor: '#3085d6',
    backdrop: true,
  });
}

onEdit(data: any) {
  //AAGP790513HH4

}

  setActiveTab(tabId: string) {
    this.activeTab = tabId; // Cambia la pestaña activa
  }


}
