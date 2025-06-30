import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ApiResponse } from 'src/app/models/ApiResponse';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';
import { FileTransferService } from 'src/app/services/file-transfer.service';
import { FormBuilder, FormGroup } from '@angular/forms';
import { RHService } from 'src/app/services/rh.service';
import { TabMaterialService } from 'src/app/services/tab-material.service';
import { formatDate } from '@angular/common';
import { CarsService } from 'src/app/services/cars.service';

@Component({
  selector: 'app-inventory',
  templateUrl: './inventory.component.html',
  styleUrls: ['./inventory.component.css']
})
export class InventoryComponent {

  searchTerm: string = '';
  headersB = ['Placa', 'Modelo', 'Marca', 'Submarca', 'Km', 'No. serie', 'color', 'verificacion', 'seguro', 'vigencia', 'Status', 'Bitacora', 'Acciones'];
  displayedColumnsB = ['placa', 'anio ', 'marca', 'modelo', 'km', 'vin', 'color', 'verificacion', 'seguro', 'vigencia', 'active'];
  dataB: any[] = [];
  headersC = ['Articulo', 'Descripcion', 'Cantidad', 'para empleado', 'creado', 'Acciones'];
  displayedColumnsC = ['name', 'description', 'quantity', 'is_assignable', "ts_created"];
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
    private rh: RHService,
    private tabMaterial: TabMaterialService,
    private cars: CarsService,
    private fileTransferService: FileTransferService
  ) {
  }

  ngOnInit(): void {
    this.getData();
  }

  onDeleteCar(car: any) {
    console.log('ID del coche a eliminar:', car.id);
    Swal.fire({
      title: '¿Estás seguro?',
      text: "¡No podrás deshacer esta acción!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, eliminar'
    }).then((result) => {
      if (result.isConfirmed) {
        // Aquí puedes llamar al servicio para eliminar el coche
        this.cars.deleteCar(car.id).subscribe((response: ApiResponse) => {
          if (response.success) {
            Swal.fire(
              'Eliminado',
              'El coche ha sido eliminado correctamente.',
              'success'
            );
            this.getData(); // Actualiza la lista de coches
          } else {
            Swal.fire(
              'Error',
              'No se pudo eliminar el coche. Inténtalo de nuevo más tarde.',
              'error'
            );
          }
        }, (error) => {
          console.error('Error al eliminar el coche:', error);
          Swal.fire(
            'Error',
            'Ocurrió un error al intentar eliminar el coche.',
            'error'
          );
        });
      }
    });

  }

  onDeleteMaterial(materialId: any) {

  }

  getData() {
    this.tabMaterial.getMateriales().subscribe((response: ApiResponse) => {
      // console.log('Datos obtenidos:', response.data);
      const fecha = response.data.ts_created
      this.dataC = response.data.map((item: any) => ({
        ...item,
        ts_created: formatDate(new Date(item.ts_created), 'yyyy-MM-dd', 'en-US')
      }));
    },
      (error) => {
        console.error('Ocurrio un error', error);
      });

    this.cars.getAllCars().subscribe((response: ApiResponse) => {
      this.dataB = response.data
    })


  }

  showDetails(row: any) {
    this.cars.getFualCarLog(row.id).subscribe((data: any) => {
      const bitacora = data.data;

      const renderTabla = () => `
      <style>
        .tabla-responsive {
          overflow-x: auto;
          max-width: 100%;
        }
        table.responsive-table {
          width: 100%;
          border-collapse: collapse;
        }
        .responsive-table th,
        .responsive-table td {
          padding: 8px;
          text-align: left;
          border: 1px solid #ddd;
          white-space: nowrap;
        }
        @media screen and (max-width: 600px) {
          .responsive-table thead {
            display: none;
          }
          .responsive-table, .responsive-table tbody, .responsive-table tr, .responsive-table td {
            display: block;
            width: 100%;
          }
          .responsive-table tr {
            margin-bottom: 15px;
            border: 1px solid #ccc;
            border-radius: 5px;
            padding: 10px;
          }
          .responsive-table td {
            text-align: right;
            position: relative;
            padding-left: 50%;
          }
          .responsive-table td::before {
            content: attr(data-label);
            position: absolute;
            left: 15px;
            width: 45%;
            padding-right: 10px;
            white-space: nowrap;
            text-align: left;
            font-weight: bold;
          }
        }
      </style>

      <button id="btnNuevoRegistro" style="margin-bottom: 10px; background-color: #3E5F8A; color: white; padding: 6px 12px; border: none; border-radius: 4px; cursor: pointer;">
        + Nuevo registro
      </button>

      <div class="tabla-responsive">
        <table class="responsive-table">
          <thead>
            <tr style="background-color: #f2f2f2;">
              <th>Fecha</th>
              <th>Inicio</th>
              <th>Fin</th>
              <th>Litros</th>
              <th>Precio</th>
              <th>Recorrido</th>
              <th>Km/L</th>
              <th>Empleado</th>
            </tr>
          </thead>
          <tbody>
            ${bitacora.map((r: any) => `
              <tr>
                <td data-label="Fecha">${new Date(r.fecha).toLocaleDateString()}</td>
                <td data-label="Inicio">${r.odometro_inicio}</td>
                <td data-label="Fin">${r.odometro_fin}</td>
                <td data-label="Litros">${r.litros}</td>
                <td data-label="Precio">${r.precio}</td>
                <td data-label="Recorrido">${r.recorridos}</td>
                <td data-label="Km/L">${r.km_litro?.toFixed(2)}</td>
                <td data-label="Empleado">${r.employee?.name || '—'}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    `;

      const abrirSwalTabla = () => {
        Swal.fire({
          title: `Bitácora del vehículo: ${row.placas || 'Sin placas'}`,
          html: renderTabla(),
          width: '1000px',
          customClass: {
            popup: 'swal-wide'
          },
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
          <input type="number" id="km" class="swal2-input" placeholder="Kilómetros">
          <input type="number" step="0.1" id="litros" class="swal2-input" placeholder="Litros">
          <input type="number" step="0.1" id="costo" class="swal2-input" placeholder="Costo">
          <textarea id="comentarios" class="swal2-textarea" placeholder="Comentarios"></textarea>
        `,
          focusConfirm: false,
          showCancelButton: true,
          confirmButtonText: 'Guardar',
          cancelButtonText: 'Cancelar',
          preConfirm: () => {
            const odometro = (document.getElementById('km') as HTMLInputElement).value;
            const litros = (document.getElementById('litros') as HTMLInputElement).value;
            const precio = (document.getElementById('costo') as HTMLInputElement).value;
            const comentarios = (document.getElementById('comentarios') as HTMLTextAreaElement).value;

            if (!odometro || !litros || !precio) {
              Swal.showValidationMessage('Todos los campos excepto comentarios son obligatorios');
              return false;
            }

          return {
            odometro: Number(odometro)+row.km,
            litros: parseFloat(litros),
            precio: parseFloat(precio),
            comentarios
          };
        }
      }).then(result => {
        if (result.isConfirmed && result.value) {
          const datos = {
            ...result.value,
            carId: row.id
          };

            this.cars.createFuelLog(datos).subscribe({
              next: () => {
                Swal.fire({
                  icon: 'success',
                  title: 'Datos guardados',
                  text: 'Registro agregado correctamente.',
                }).then(() => {
                  this.showDetails(row);
                });
              },
              error: (err) => {
                Swal.fire({
                  icon: 'error',
                  title: 'Error',
                  text: 'Ocurrió un error al guardar los datos.',
                });
                console.error(err);
              }
            });
          }
        });
      };

      abrirSwalTabla();
    });
  }

  onEditCar(id: any) {
    // console.log('Editar vehículo:', data.id);
    // const id = data.id; // Obtiene el ID del empleado
    // this.fileTransferService.setIdTercero(id); // Establece el ID del
    this.router.navigate(['/pages/RH/Registrar-Automovil/' + id]);
  }

  onEditMat(data: any) {
    //AAGP790513HH4

  }

  setActiveTab(tabId: string) {
    this.activeTab = tabId; // Cambia la pestaña activa
  }







}
