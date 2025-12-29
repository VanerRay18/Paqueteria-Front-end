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
import { saveAs } from 'file-saver';
import * as XLSX from 'xlsx';

@Component({
  selector: 'app-inventory',
  templateUrl: './inventory.component.html',
  styleUrls: ['./inventory.component.css'],
  standalone: false
})
export class InventoryComponent {

  searchTerm: string = '';
  headersB = ['Placa', 'Modelo', 'Marca', 'Submarca', 'Km', 'No. serie', 'color', 'verificacion', 'seguro', 'vigencia', 'Status', 'Odometro', 'Acciones'];
  displayedColumnsB = ['placa', 'anio', 'marca', 'modelo', 'km', 'vin', 'color', 'verificacion', 'seguro', 'vigencia', 'active'];
  dataB: any[] = [];
  headersC = ['Articulo', 'Descripcion', 'Cantidad', 'para empleado', 'creado', 'Acciones'];
  displayedColumnsC = ['name', 'description', 'quantity', 'is_assignable', "ts_created"];
  dataC: any[] = [];
  headersU = ['Categoria', 'Prenda', 'Cantidad', 'Talla', 'Acciones'];
  displayedColumnsU = ['category_name', 'product_name', 'cant', 'item_name'];
  dataU: any[] = [];
  isLoading = false;
  totalRecords: any;
  info: any;
  arrayUserRecibido: any;
  activeTab: string = 'contrato';

  tabs = [
    { id: 'base', title: 'Automoviles', icon: 'fa-solid fa-truck-moving' },
    { id: 'contrato', title: 'Materiales', icon: 'fa-solid fa-box-open' },
    { id: 'uniformes', title: 'Uniformes', icon: 'fa-solid fa-restroom' }
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


  getData() {
    this.tabMaterial.getMateriales().subscribe((response: ApiResponse) => {

      const fecha = response.data.ts_created
      this.dataC = response.data.map((item: any) => ({
        ...item,
        ts_created: formatDate(new Date(item.ts_created), 'yyyy-MM-dd', 'en-US'),
        is_assignable: item.active ? 'Si' : 'No',
      }));
    },
      (error) => {
        console.error('Ocurrio un error', error);
      });

    this.cars.getAllCars().subscribe((response: ApiResponse) => {
      this.totalRecords = response.message;
      this.dataB = response.data.map((item: any) => ({
        ...item,
        vigencia: formatDate(new Date(item.vigencia), 'yyyy-MM-dd', 'en-US'),
        active: item.active ? 'Activo' : 'Inactivo',
      }));

    })

    this.tabMaterial.getUniformes().subscribe((response: ApiResponse) => {
      this.dataU = response.data.map((item: any) => ({
        ...item,
      }));
    });

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
              <th>Estación</th>
              <th>Ruta</th>
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
                <td data-label="Estación">${r.estacion || '—'}</td>
                <td data-label="Ruta">${r.ruta || '—'}</td>
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
                    <input type="text" step="0.1" id="estacion" class="swal2-input" placeholder="Estación">
                    <input type="text" id="ruta" class="swal2-input" placeholder="Ruta">
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
            const estacion = (document.getElementById('estacion') as HTMLInputElement).value;
            const ruta = (document.getElementById('ruta') as HTMLInputElement).value;
            const comentarios = (document.getElementById('comentarios') as HTMLTextAreaElement).value;

            if (!odometro || !litros || !precio || !estacion || !ruta) {
              Swal.showValidationMessage('Todos los campos excepto comentarios son obligatorios');
              return false;
            }
            if (odometro <= row.km) {
              Swal.showValidationMessage('El odómetro debe ser mayor que el kilometraje actual: ' + row.km);
              return false;
            }

            return {
              odometro: Number(odometro),
              litros: parseFloat(litros),
              precio: parseFloat(precio),
              estacion,
              ruta,
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
                this.getData(); // Recargar tabla de vehículos
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
        const isAssignable = (document.getElementById('swal-assignable') as HTMLSelectElement).value === 'true';
        const quantity = parseInt((document.getElementById('swal-quantity') as HTMLInputElement).value, 10);

        if (!name || !description || isNaN(quantity) || quantity <= 0) {
          Swal.showValidationMessage('Por favor llena todos los campos correctamente');
          return;
        }


        return { name, description, isAssignable, quantity };
      }
    }).then((result) => {
      if (result.isConfirmed && result.value) {
        const { name, description, isAssignable, quantity } = result.value;

        this.tabMaterial.createMaterial({
          name,
          description,
          isAssignable
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

  onDeleteCar(car: any) {
    // console.log('ID del coche a eliminar:', car.id);
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

        const quantityMaterialId = catMaterial.id;
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
              this.tabMaterial.updateMaterial({ name, description, isAssignable }, quantityMaterialId).subscribe({
                next: (response) => {

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

  async openDateRangeSwal(): Promise<void> {
    const { value: fechas } = await Swal.fire({
      title: 'Generar Excel — rango de fechas',
      html: `
        <input type="date" id="swal-desde" class="swal2-input" placeholder="Desde">
        <input type="date" id="swal-hasta" class="swal2-input" placeholder="Hasta">
      `,
      confirmButtonText: 'Descargar',
      focusConfirm: false,
      showCancelButton: true,
      cancelButtonText: 'Cancelar',
      preConfirm: () => {
        const desde = (document.getElementById('swal-desde') as HTMLInputElement).value;
        const hasta = (document.getElementById('swal-hasta') as HTMLInputElement).value;

        if (!desde || !hasta) {
          Swal.showValidationMessage('Ambas fechas son obligatorias');
          return;
        }
        if (new Date(desde) > new Date(hasta)) {
          Swal.showValidationMessage('“Desde” no puede ser mayor que “Hasta”');
          return;
        }
        return { desde, hasta };
      }
    });

    if (fechas) {
      this.getExcelCars(fechas.desde, fechas.hasta);
    }
  }

  /** Tu método existente para generar el Excel */
  getExcelCars(desde: string, hasta: string): void {
    this.cars.getExcelCars(desde, hasta).subscribe((response: ApiResponse) => {
      if (response.success) {
        console.log('Respuesta del servidor para Excel:', response);
        // Maneja la respuesta, por ejemplo descargando el archivo:
        // Extrae el array correcto y (opcional) los totales
        const payload = response.data; // { data: [...], recorrido, dineroTotal, gasTotal }
        const data = Array.isArray(payload?.data) ? payload.data : [];
        const { recorrido, dineroTotal, gasTotal } = payload || {};

        if (!Array.isArray(data)) {
          console.error('data no es array:', payload);
          Swal.fire('Error', 'El JSON no contiene una lista de registros', 'error');
          return;
        }

        // Helpers
        const formatFecha = (ms?: number | null) => {
          if (!ms && ms !== 0) return '';
          const d = new Date(ms);
          const yyyy = d.getFullYear();
          const mm = String(d.getMonth() + 1).padStart(2, '0');
          const dd = String(d.getDate()).padStart(2, '0');
          return `${yyyy}-${mm}-${dd}`;
        };
        // Mapeo de filas (ajusta títulos si quieres)
        const datosExcel = data.map((item: { fecha: number | null | undefined; operador: any; auto: any; litrosCargado: any; costoLitro: any; totalCargado: any; recorrido: any; inicio: any; fin: any; kmL: any; ruta: any; estacionProovedor: any; }, index: number) => ({
          '#': index + 1,
          'Fecha': formatFecha(item.fecha),
          'Operador': item.operador || '',
          'Auto': item.auto || '',
          'Litros cargados': item.litrosCargado,
          'Costo por litro': item.costoLitro,
          'Total cargado': item.totalCargado,
          'Recorrido (km)': item.recorrido,
          'Inicio odómetro': item.inicio,
          'Fin odómetro': item.fin,
          'Rendimiento (km/L)': item.kmL,
          'Ruta': item.ruta || '',
          'Estación/Proveedor': item.estacionProovedor || ''
        }));

        // Crear hoja y libro
        const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(datosExcel);
        ws['!cols'] = Object.keys(datosExcel[0] || {}).map(() => ({ wch: 18 })); // opcional
        const wb: XLSX.WorkBook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, 'Reporte');

        // Exportar correctamente como XLSX
        const excelBuffer: ArrayBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
        const blob = new Blob([excelBuffer], {
          type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
        });

        const hoy = new Date().toISOString().split('T')[0];
        const rango = `${desde}_a_${hasta}`.replace(/[:/]/g, '-');
        saveAs(blob, `reporte_cargas_${rango}_${hoy}.xlsx`);
        Swal.fire('Éxito', 'Archivo Excel generado', 'success');
      } else {
        Swal.fire('Error', 'No se pudo generar el archivo Excel', 'error');
      }
    });
  }


  onDeleteUniform(uniformId: any) {
    // Swal.fire({
    //   title: '¿Estás seguro?',
    //   text: 'Este uniforme será eliminado.',
    //   icon: 'warning',
    //   showCancelButton: true,
    //   confirmButtonText: 'Sí, eliminar',
    //   cancelButtonText: 'Cancelar'
    // }).then((result) => {
    //   if (result.isConfirmed) {
    //     this.tabUniform.deleteUniform(uniformId.id).subscribe({
    //       next: () => {
    //         this.tabUniform.DeleteQuantityUniform(uniformId.id).subscribe({
    //           next: () => {
    //             Swal.fire('Eliminado', 'El uniforme fue eliminado correctamente.', 'success');
    //             this.getData(); // Recargar tabla
    //           },
    //           error: (error) => {
    //             console.error('Error al eliminar cantidad de uniforme:', error);
    //           }
    //         });
    //       },
    //       error: (error) => {
    //         console.error('Error al eliminar uniforme:', error);
    //         Swal.fire('Error', 'No se pudo eliminar el uniforme.', 'error');
    //       }
    //     });
    //   }
    // });
  }

  onEditUniform(uniform: any) {
    console.log('Uniforme a editar:', uniform);
    // uniform debe tener: { uniformId, itemId, productItemId, quantity }

    Swal.fire({
      title: 'Editar Cantidad de Uniforme',
      html: `
      <div style="display:flex; flex-direction:column; gap:15px; padding:5px;">
        
        <label style="font-weight:600;">Cantidad:</label>

        <div style="display:flex; justify-content:center; gap:12px; align-items:center;">
          <button id="btn-minus" 
            style="background:#d9534f; color:white; border:none; padding:10px 15px; border-radius:8px; font-size:18px; cursor:pointer;">
            -
          </button>

          <input id="uniform-quantity" 
            type="number" 
            value="${uniform.cant}" 
            min="0"
            style="width:80px; padding:10px; text-align:center; border-radius:8px; border:1px solid #ccc;" />

          <button id="btn-plus" 
            style="background:#5cb85c; color:white; border:none; padding:10px 15px; border-radius:8px; font-size:18px; cursor:pointer;">
            +
          </button>
        </div>
      </div>
    `,
      showCancelButton: true,
      confirmButtonText: 'Guardar',
      cancelButtonText: 'Cancelar',
      focusConfirm: false,
      didOpen: () => {
        const input = document.getElementById('uniform-quantity') as HTMLInputElement;

        // Botón +
        document.getElementById('btn-plus')?.addEventListener('click', () => {
          input.value = (parseInt(input.value, 10) + 1).toString();
        });

        // Botón -
        document.getElementById('btn-minus')?.addEventListener('click', () => {
          const current = parseInt(input.value, 10);
          if (current > 0) input.value = (current - 1).toString();
        });
      },
      preConfirm: () => {
        const qty = parseInt(
          (document.getElementById('uniform-quantity') as HTMLInputElement).value,
          10
        );

        if (isNaN(qty) || qty < 0) {
          Swal.showValidationMessage('La cantidad debe ser mayor o igual a 0');
          return;
        }

        return qty;
      }
    }).then(result => {

      if (!result.isConfirmed) return;

      const nuevaCant = result.value;

      Swal.fire({
        title: 'Guardando...',
        text: 'Por favor espera',
        allowOutsideClick: false,
        didOpen: () => {
          Swal.showLoading(); // Muestra loader
        }
      });

      // 🚀 Llamada para ACTUALIZAR
      this.tabMaterial.updateCantUniform(
        uniform.cat_uniform_item_id,
        uniform.cat_uniform_product_id,
        nuevaCant,
        uniform.id
      ).subscribe({
        next: () => {
          Swal.fire('Éxito', 'Cantidad actualizada correctamente.', 'success');
          this.getData(); // ⚡ Recargar tabla o listado
        },
        error: (err) => {
          console.error(err);
          Swal.fire('Error', 'No se pudo actualizar la cantidad.', 'error');
        }
      });

    });
  }


  addUniform() {
    // Swal.fire({
    //   title: '¿Estás seguro?',
    //   text: 'Este uniforme será eliminado.',
    //   icon: 'warning',
    //   showCancelButton: true,
    //   confirmButtonText: 'Sí, eliminar',
    //   cancelButtonText: 'Cancelar'
    // }).then((result) => {
    //   if (result.isConfirmed) {
    //     this.tabUniform.deleteUniform(uniformId.id).subscribe({
    //       next: () => {
    //         this.tabUniform.DeleteQuantityUniform(uniformId.id).subscribe({
    //           next: () => {
    //             Swal.fire('Eliminado', 'El uniforme fue eliminado correctamente.', 'success');
    //             this.getData(); // Recargar tabla
    //           },
    //           error: (error) => {
    //             console.error('Error al eliminar cantidad de uniforme:', error);
    //           }
    //         });
    //       },
    //       error: (error) => {
    //         console.error('Error al eliminar uniforme:', error);
    //         Swal.fire('Error', 'No se pudo eliminar el uniforme.', 'error');
    //       }
    //     });
    //   }
    // });
  }

}