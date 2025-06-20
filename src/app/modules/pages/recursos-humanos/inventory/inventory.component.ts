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
  headersB = ['Placa', 'Modelo', 'Marca', 'Submarca', 'No. serie', 'Compañia de seguros', 'Vigencia', 'Verificacion', 'Status', 'Bitacora', 'Acciones'];
  displayedColumnsB = ['placa', 'modelo ', 'marca', 'submarca', 'vin', 'cat_job_id', 'cat_employment_id', 'phone', 'active'];
  dataB: any[] = [];
  headersC = ['Articulo', 'Descripcion', 'Categoria', 'Cantidad', 'Status', 'Informacion', 'Acciones'];
  displayedColumnsC = ['Articulo', 'Descripcion', 'Categoria', 'Cantidad', 'active'];
  dataC: any[] = [];
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
    // Asegura que tenga su bitácora. Si no, se crea vacía.
    if (!row.bitacora) {
      row.bitacora = [];
    }

    const renderTabla = () => `
    <button id="btnNuevoRegistro" style="margin-bottom: 10px; background-color: #3E5F8A; color: white; padding: 6px 12px; border: none; border-radius: 4px; cursor: pointer;">
      + Nuevo registro
    </button>
    <table class="table table-bordered" style="width: 100%; font-size: 14px;">
      <thead>
        <tr style="background-color: #f2f2f2;">
          <th>Fecha</th>
          <th>Kilómetros</th>
          <th>Gasolina</th>
          <th>Comentarios</th>
        </tr>
      </thead>
      <tbody>
        ${row.bitacora.map((r: any) => `
          <tr>
            <td>${r.fecha}</td>
            <td>${r.km}</td>
            <td>${r.gasolina}</td>
            <td>${r.comentarios}</td>
          </tr>
        `).join('')}
      </tbody>
    </table>
  `;

    const abrirSwalTabla = () => {
      Swal.fire({
        title: `Bitácora del vehículo: ${row.placas || 'Sin placas'}`,
        html: renderTabla(),
        width: '800px',
        showConfirmButton: true,
        confirmButtonText: 'Cerrar',
        allowOutsideClick: false,
        didOpen: () => {
          const btn = document.getElementById('btnNuevoRegistro');
          if (btn) {
            btn.addEventListener('click', () => abrirSwalFormulario());
          }
        }
      });
    };

    const abrirSwalFormulario = () => {
      Swal.fire({
        title: 'Agregar nuevo registro',
        html: `
        <input type="date" id="fecha" class="swal2-input" placeholder="Fecha">
        <input type="number" id="km" class="swal2-input" placeholder="Kilómetros">
        <input type="text" id="gasolina" class="swal2-input" placeholder="Gasolina (Ej: Lleno, 1/2)">
        <textarea id="comentarios" class="swal2-textarea" placeholder="Comentarios"></textarea>
      `,
        focusConfirm: false,
        showCancelButton: true,
        confirmButtonText: 'Guardar',
        cancelButtonText: 'Cancelar',
        preConfirm: () => {
          const fecha = (document.getElementById('fecha') as HTMLInputElement).value;
          const km = (document.getElementById('km') as HTMLInputElement).value;
          const gasolina = (document.getElementById('gasolina') as HTMLInputElement).value;
          const comentarios = (document.getElementById('comentarios') as HTMLTextAreaElement).value;

          if (!fecha || !km || !gasolina) {
            Swal.showValidationMessage('Fecha, kilómetros y gasolina son obligatorios');
            return false;
          }

          // Agrega al array del vehículo
          row.bitacora.push({ fecha, km, gasolina, comentarios });

          return true; // 👈 Esto resuelve el error
        }
      }).then(result => {
        if (result.isConfirmed) {
          abrirSwalTabla(); // Vuelve a mostrar la tabla con el nuevo registro
        }
      });
    };

    abrirSwalTabla(); // Muestra la tabla inicial
  }

  onEdit(data: any) {
    //AAGP790513HH4

  }

  setActiveTab(tabId: string) {
    this.activeTab = tabId; // Cambia la pestaña activa
  }


}
