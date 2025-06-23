
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ApiResponse } from 'src/app/models/ApiResponse';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';
import { FileTransferService } from 'src/app/services/file-transfer.service';
import { FormBuilder, FormGroup } from '@angular/forms';
import { RHService } from 'src/app/services/rh.service';

@Component({
  selector: 'app-crudemployee',
  templateUrl: './crudemployee.component.html',
  styleUrls: ['./crudemployee.component.css']
})
export class CRUDEmployeeComponent {
  searchTerm: string = '';
  headersB = ['Nombre','Primer Apellido','Segundo Apellido','RFC','CURP', 'Tipo de contratacion', 'Puesto', 'Telefono', 'Status','Acciones'];
  displayedColumnsB = ['name','first_surname','second_surname','rfc','curp', 'cat_job_id', 'cat_employment_id', 'phone', 'active'];
  dataB:any[] = [];
  headersC = ['Nombre','Primer Apellido','Segundo Apellido','RFC','CURP', 'Tipo de contratacion', 'Puesto', 'Telefono', 'Status','Acciones'];
  displayedColumnsC = ['name','first_surname','second_surname','rfc','curp', 'cat_job_id', 'cat_employment_id', 'phone', 'active'];
  dataC:any[] = [];
  isLoading = false;
  info: any;
  arrayUserRecibido: any;
  activeTab: string = 'base';
  tabs = [
    { id: 'base', title: 'Por contrato', icon: 'fa-solid fa-file-csv' },
    { id: 'contrato', title: 'Por honorarios', icon: 'fa-solid fa-file-csv' }
  ];

  constructor(
    private router: Router,
    private cdr: ChangeDetectorRef,
    private fb: FormBuilder,
    private rh: RHService,
    private fileTransferService: FileTransferService
  ) {
  }

  ngOnInit(): void {
    this.getData();
  }

  onDelete(licenciaId: any) {

  }

getData() {
  this.rh.getEmployees().subscribe((response: ApiResponse) => {
// console.log('Datos obtenidos:', response.data);
   this.dataB = response.data.individual;
   this.dataC = response.data.honorarios;
    // console.log('Datos obtenidos:', this.data);
  },
    (error) => {
      // console.error('Error al obtener los datos:', error);
      console.error('Ocurrio un error', error);
    });

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

onEdit(employeeId: any) {
  console.log('ID del empleado a editar:', employeeId.id);
  const id = employeeId.id; // Obtiene el ID del empleado
  this.fileTransferService.setIdTercero(id); // Establece el ID del
  this.router.navigate(['/pages/RH/Registrar-Trabajador']); // Navega a la página de edición del empleado


}

  setActiveTab(tabId: string) {
    this.activeTab = tabId; // Cambia la pestaña activa
  }

}
