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
    Swal.fire({
      title: '¿Estás seguro?',
      text: 'Este material será eliminado.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.tabMaterial.deleteMaterial(materialId.id).subscribe({
          next: () => {
            this.tabMaterial.DeleteQuantityMaterial(materialId.id).subscribe({
              next: () => {
                Swal.fire('Eliminado', 'El material fue eliminado correctamente.', 'success');
                this.getData(); // Recargar tabla
              },
              error: (error) => {
                console.error('Error al eliminar cantidad de material:', error);
              }
            });
          },
          error: (error) => {
            console.error('Error al eliminar material:', error);
            Swal.fire('Error', 'No se pudo eliminar el material.', 'error');
          }
        });
      }
    });
  }


  getData() {
    this.tabMaterial.getMateriales().subscribe((response: ApiResponse) => {
      console.log('Datos obtenidos:', response.data);
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
              odometro: Number(odometro) + row.km,
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

  addMaterial() {
    Swal.fire({
      title: 'Agregar nuevo material',
      html: `
      <div style="display: flex; flex-direction: column; gap: 12px; text-align: left;">
        <input id="swal-name" class="swal2-input" placeholder="📝 Nombre del material">
        <input id="swal-description" class="swal2-input" placeholder="📄 Descripción">
        
        <div>
          <label style="font-weight: 600; margin-left: 5px;">📦 ¿Asignable al usuario?</label>
          <select id="swal-assignable" class="swal2-input" style="padding: 10px; font-size: 16px; height: auto;">
            <option value="true">✅ Sí, asignable</option>
            <option value="false">❌ No asignable</option>
          </select>
        </div>

        <input id="swal-quantity" type="number" min="1" class="swal2-input" placeholder="🔢 Cantidad">
      </div>
    `,
      focusConfirm: false,
      showCancelButton: true,
      confirmButtonText: 'Guardar',
      cancelButtonText: 'Cancelar',
      preConfirm: () => {
        const name = (document.getElementById('swal-name') as HTMLInputElement).value.trim();
        const description = (document.getElementById('swal-description') as HTMLInputElement).value.trim();
        const is_assignable = (document.getElementById('swal-assignable') as HTMLSelectElement).value === 'true';
        const quantity = parseInt((document.getElementById('swal-quantity') as HTMLInputElement).value, 10);

        if (!name || !description || isNaN(quantity) || quantity <= 0) {
          Swal.showValidationMessage('Por favor llena todos los campos correctamente');
          return;
        }

        return { name, description, is_assignable, quantity };
      }
    }).then((result) => {
      if (result.isConfirmed && result.value) {
        const { name, description, is_assignable, quantity } = result.value;

        this.tabMaterial.createMaterial({
          name,
          description,
          is_assignable
        }).subscribe((response: ApiResponse) => {
          const catMaterialId = response.data;

          if (catMaterialId) {
            this.tabMaterial.quantityMaterial(catMaterialId, quantity).subscribe(() => {
              Swal.fire('Éxito', 'Material agregado correctamente', 'success');
              this.getData();
            }, (error) => {
              console.error('Error al agregar cantidad:', error);
              Swal.fire('Error', 'No se pudo agregar la cantidad', 'error');
            });
          } else {
            Swal.fire('Error', 'No se recibió el ID del material creado', 'error');
          }
        }, (error) => {
          console.error('Error al crear material:', error);
          Swal.fire('Error', 'No se pudo crear el material', 'error');
        });
      }
    });
  }



  onEditCar(id: any) {
    // console.log('Editar vehículo:', data.id);
    // const id = data.id; // Obtiene el ID del empleado
    // this.fileTransferService.setIdTercero(id); // Establece el ID del
    this.router.navigate(['/pages/RH/Registrar-Automovil/' + id]);
  }

  onEditMat(materialId: any) {
  // Llamada al servicio para obtener los datos del material
  this.tabMaterial.getMaterialById(materialId.id).subscribe(response => {
    if (response.success) {
      const { quantity, catMaterial } = response.data;
      const quantityMaterialId  = quantity.id;
      // Llenar los campos del modal con la respuesta
      Swal.fire({
        title: 'Editar Material',
        html: `
        <div style="display: flex; flex-direction: column; gap: 14px; width: 100%; box-sizing: border-box; text-align: center;">
          <!-- Sección de material -->
          <div>
            <label for="swal-material-name" style="font-weight: 600; margin-bottom: 5px; display: block;">Nombre del Material:</label>
            <input id="swal-material-name" class="swal2-input" value="${catMaterial.name}" placeholder="Nombre del material" style="padding: 10px; text-align: center;"/>
          </div>
          <div>
            <label for="swal-material-description" style="font-weight: 600; margin-bottom: 5px; display: block;">Descripción:</label>
            <input id="swal-material-description" class="swal2-input" value="${catMaterial.description || ''}" placeholder="Descripción" style="padding: 10px; text-align: center;"/>
          </div>
          <div>
            <label for="swal-material-assignable" style="font-weight: 600; margin-bottom: 5px; display: block;">Asignable al Usuario:</label>
            <select id="swal-material-assignable" class="swal2-input" style="padding: 10px; text-align: center;">
              <option value="true" ${catMaterial.isAssignable ? 'selected' : ''}>Asignable</option>
              <option value="false" ${!catMaterial.isAssignable ? 'selected' : ''}>No Asignable</option>
            </select>
          </div>
          <button id="saveMaterialBtn" class="swal2-confirm swal2-styled" style="background-color: #28a745; color: white; padding: 10px 20px; border-radius: 5px; margin-top: 15px;">Guardar Material</button>
          <hr />
          
          <!-- Sección de cantidad -->
          <div>
            <label for="swal-material-quantity" style="font-weight: 600; margin-bottom: 5px; display: block;">Cantidad:</label>
            <div style="display: flex; align-items: center; justify-content: center; gap: 15px;">
              <button id="swal-quantity-minus" class="swal2-input" style="font-size: 20px; padding: 10px 15px; border-radius: 5px; background-color: #f44336; color: white;" type="button">-</button>
              <input id="swal-material-quantity" type="number" class="swal2-input" value="${quantity.quantity}" min="0" placeholder="Cantidad" style="width: 80px; padding: 10px; text-align: center;"/>
              <button id="swal-quantity-plus" class="swal2-input" style="font-size: 20px; padding: 10px 15px; border-radius: 5px; background-color: #4caf50; color: white;" type="button">+</button>
            </div>
            <button id="saveQuantityBtn" class="swal2-confirm swal2-styled" style="background-color: #007bff; color: white; padding: 10px 20px; border-radius: 5px; margin-top: 15px;">Guardar Cantidad</button>
          </div>
        </div>
        `,
        showCancelButton: true,
        cancelButtonText: 'Cerrar',
        focusConfirm: false,
        showLoaderOnConfirm: true,
        preConfirm: () => {
          const name = (document.getElementById('swal-material-name') as HTMLInputElement).value.trim();
          const description = (document.getElementById('swal-material-description') as HTMLInputElement).value.trim();
          const isAssignable = (document.getElementById('swal-material-assignable') as HTMLSelectElement).value === 'true';
          const quantity = parseInt((document.getElementById('swal-material-quantity') as HTMLInputElement).value, 10);

          if (!name || !description || isNaN(quantity) || quantity < 0) {
            Swal.showValidationMessage('Por favor, llena todos los campos correctamente.');
            return;
          }

          return { name, description, isAssignable, quantity };
        },
        didOpen: () => {
          // Botón de incrementar
          const quantityInput = document.getElementById('swal-material-quantity') as HTMLInputElement;
          document.getElementById('swal-quantity-plus')?.addEventListener('click', () => {
            quantityInput.value = (parseInt(quantityInput.value, 10) + 1).toString();
          });

          // Botón de decrementar
          document.getElementById('swal-quantity-minus')?.addEventListener('click', () => {
            if (parseInt(quantityInput.value, 10) > 0) {
              quantityInput.value = (parseInt(quantityInput.value, 10) - 1).toString();
            }
          });

          // Guardar Material
          const saveMaterialBtn = document.getElementById('saveMaterialBtn');
          saveMaterialBtn?.addEventListener('click', () => {
            const name = (document.getElementById('swal-material-name') as HTMLInputElement).value.trim();
            const description = (document.getElementById('swal-material-description') as HTMLInputElement).value.trim();
            const isAssignable = (document.getElementById('swal-material-assignable') as HTMLSelectElement).value === 'true';

            // Actualizar el material
            this.tabMaterial.createMaterial({ name, description, isAssignable }).subscribe({
              next: (response) => {
                console.log('Material actualizado:', response);
                Swal.fire('Éxito', 'Material actualizado correctamente.', 'success');
                this.getData(); // Recargar los datos de la tabla
              },
              error: (error) => {
                console.error('Error al actualizar material:', error);
                Swal.fire('Error', 'No se pudo actualizar el material', 'error');
              }
            });
          });

          // Guardar Cantidad
          const saveQuantityBtn = document.getElementById('saveQuantityBtn');
          saveQuantityBtn?.addEventListener('click', () => {
            const quantity = parseInt((document.getElementById('swal-material-quantity') as HTMLInputElement).value, 10);            // Actualizar la cantidad
            this.tabMaterial.UpdateQuantityMaterial(quantityMaterialId, quantity).subscribe({
              next: () => {
                Swal.fire('Éxito', 'Cantidad actualizada correctamente.', 'success');
                this.getData(); // Recargar los datos de la tabla
              },
              error: (error) => {
                console.error('Error al actualizar cantidad:', error);
                Swal.fire('Error', 'No se pudo actualizar la cantidad', 'error');
              }
            });
          });
        }
      });
    }
  });
}



  setActiveTab(tabId: string) {
    this.activeTab = tabId; // Cambia la pestaña activa
  }







}
