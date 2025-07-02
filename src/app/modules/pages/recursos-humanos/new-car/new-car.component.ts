import { FileTransferService } from './../../../../services/file-transfer.service';
import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RHService } from 'src/app/services/rh.service';
import { ApiResponse } from 'src/app/models/ApiResponse';
import Swal from 'sweetalert2';
import { ActivatedRoute, Router } from '@angular/router';
import { CarsService } from 'src/app/services/cars.service';
import { take } from 'rxjs';

@Component({
  selector: 'app-new-car',
  templateUrl: './new-car.component.html',
  styleUrls: ['./new-car.component.css']
})
export class NewCarComponent implements OnInit {
  carForm!: FormGroup;
  fotoPreview: string = '';
  catEmployees: any[] = [];
  fotosPreview: string[] = [];
  fotoActual: number = 0;
  fotosSeleccionadas: File[] = [];
  carID: any;
  isEditMode = false;
  isEditDocumentos = false;
  fotosAntiguasIds: number[] = [];
  activeTab: 'vehiculo' | 'servicios' | 'historico' = 'vehiculo';
  catServicios: any[] = [];
  serviciosActuales: any[] = [];
  nuevoServicio: any = { catServiceCarId: '', km: '', total: '', isService: true };
  historialServicios: any[] = [];
  kmActualDelCoche: number = 0;
  canService = false; // Variable para controlar si se puede agregar un servicio
  fotosAntiguas: any;

  constructor(
    private fb: FormBuilder,
    private car: CarsService,
    private router: Router,
    private route: ActivatedRoute,
    private fileTransferService: FileTransferService,
  ) { }

  ngOnInit(): void {
    this.forms();
    let id = this.route.snapshot.paramMap.get('id') ? Number(this.route.snapshot.paramMap.get('id')) : 0;
    if (id !== 0) {
      this.carID = id
      this.canService = true; // Permitir agregar servicios si hay un ID de coche
      this.isEditMode = true;
      this.loadEmployeeData(this.carID);
    }


    this.getData();

  }

  getData() {
    this.car.getCatService().subscribe((res) => this.catServicios = res.data);
    this.car.getCatEmpl().subscribe({
      next: (response) => {
        this.catEmployees = response.data;
        // console.log('Datos de todos los empleados:', response);
      },
      error: (err) => {
        console.error('Error al obtener datos de empleados', err);
      }
    });
  }

  formatearFecha(fecha: string | Date): string {
    const d = new Date(fecha);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  get todasLasFotos(): string[] {
    return this.fotosPreview.length > 0 ? this.fotosPreview : this.fotosAntiguas;
  }


  loadEmployeeData(carId: any) {
    if (this.isEditMode) {
      this.cargarServiciosActuales();
      this.cargarHistorialServicios();
      this.car.getCarById(this.carID).subscribe({
        next: (response) => {

          const carData = response.data.car;
          const carTieneDatos = carData && Object.values(carData).some(value => !!value);

          if (!carTieneDatos) return;
          // 👉 Llenar las fotos antiguas
        this.fotosAntiguas = response.data.images.map((img: any) => img.path);
         

          setTimeout(() => {
            this.fotoActual = 0;
          }, 0);
          this.kmActualDelCoche = carData.km || 0;
          this.carForm.patchValue({
            foto: response.data.images,
            placa: carData.placa,
            modelo: carData.anio,
            marca: carData.marca,
            submarca: carData.modelo,
            serie: carData.vin,
            seguros: carData.seguros,
            vigencia: this.formatearFecha(carData.vigencia),
            verificacion: carData.verificacion,
            estado: {
              activo: carData.active
            },
            responsable: carData.employeeId,
            km: carData.km || 0,
            color: carData.color || '',

          });

          this.carForm.disable();
        },
        error: (err) => {
          console.error('Error al obtener datos del vehículo', err);
        }
      });
    }
  }

  actualizarTotal() {
    const kmNuevo = Number(this.nuevoServicio.km) || 0;
    const kmActual = this.kmActualDelCoche || 0;
    this.nuevoServicio.total = kmNuevo + kmActual;
  }

  forms() {
    this.carForm = this.fb.group({
      foto: [null],
      placa: [''],
      modelo: [''],
      marca: [''],
      submarca: [''],
      serie: [''],
      seguros: [''],
      vigencia: [''],
      verificacion: [''],
      estado: this.fb.group({
        activo: [true]  // o false
      }),
      responsable: [''],
      km: [0, [Validators.required, Validators.min(0)]],
      color: [''],
    });
  }


onFotoSelected(event: any): void {
  const files: FileList = event.target.files;

  if (files && files.length > 0) {
    Array.from(files).forEach((file) => {
      // Previsualización
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.fotosPreview.push(e.target.result);
      };
      reader.readAsDataURL(file);

      // Acumular archivos seleccionados
      this.fotosSeleccionadas.push(file);
    });

    if (this.fotoActual >= this.fotosPreview.length) {
      this.fotoActual = 0;
    }
  }
}



  anteriorFoto(): void {

    const total = this.todasLasFotos.length;
    if (total > 0) {
      this.fotoActual = (this.fotoActual - 1 + total) % total;
    }
  }

  siguienteFoto(): void {
    const total = this.todasLasFotos.length;
    if (total > 0) {
      this.fotoActual = (this.fotoActual + 1) % total;
    }
  }

  habilitarEdicion() {
    this.carForm.enable();
    Swal.fire('Edición activada', 'Puedes modificar los datos y volver a guardar.', 'info');

  }


  guardarDatosPersonales() {
    const formValue = this.carForm.value;

    const dto = {
      placa: formValue.placa,
      marca: formValue.marca,
      modelo: formValue.submarca,
      anio: formValue.modelo,
      seguro: formValue.seguros,
      verificacion: formValue.verificacion,
      vigencia: formValue.vigencia,
      vin: formValue.serie,
      color: formValue.color || '',
      active: formValue.estado.activo,
      km: Number(formValue.km) || 0,
      employeeId: Number(formValue.responsable) || null
    };

    if (this.isEditMode && this.carID) {
      // 🔄 Modo edición
      this.car.updateCar(dto, this.carID).subscribe({
        next: () => {
          // 🧹 Si hay fotos anteriores, se eliminan
          if (this.fotosAntiguasIds?.length > 0) {
            this.car.deleteFile(this.fotosAntiguasIds).subscribe({
              next: () => this.subirFotos(this.carID, true),
              error: (err) => {
                console.error('Error al eliminar fotos', err);
                this.subirFotos(this.carID, true);
              }
            });
          } else {
            this.subirFotos(this.carID, true);
          }
        },
        error: (err) => {
          console.error('Error al actualizar vehículo', err);
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Ocurrió un error al actualizar los datos del vehículo.',
          });
        }
      });
  } else {
    this.car.createNewCar(dto).subscribe({
      next: (response) => {
        const carId = response.data; // Asegúrate que sea el ID directo
        if (!carId) {
          Swal.fire('Error', 'No se pudo obtener el ID del vehículo creado.', 'error');
          return;
        }
        this.subirFotos(carId, false);
      },
      error: (err) => {
        console.error('Error al crear vehículo', err);
        Swal.fire('Error', 'Ocurrió un error al guardar los datos del vehículo.', 'error');
      }
    });
  }
}
  subirFotos(carId: number, esEdicion: boolean) {
    if (this.fotosSeleccionadas.length > 0) {
      const formData = new FormData();
      this.fotosSeleccionadas.forEach((file) => {
        formData.append('files', file);
      });

      this.car.SaveFoto(formData, '', carId, 'car').subscribe({
        
        next: () => {
          Swal.fire({
            icon: 'success',
            title: esEdicion ? 'Datos actualizados' : 'Datos guardados',
            text: esEdicion
              ? 'El vehículo y las fotos fueron actualizados correctamente.'
              : 'El vehículo fue registrado correctamente.',
          });
this.router.navigate(['/pages/RH/Inventario']);
        },
        error: (err) => {
          console.error('Error al subir fotos', err);
          Swal.fire({
            icon: 'warning',
            title: esEdicion ? 'Vehículo actualizado, pero...' : 'Vehículo guardado, pero...',
            text: 'No se pudieron subir las fotos.',
          });

        }
      });
    } else {
      Swal.fire({
        icon: 'success',
        title: esEdicion ? 'Datos actualizados' : 'Datos guardados',
        text: esEdicion
          ? 'El vehículo fue actualizado correctamente.'
          : 'El vehículo fue registrado correctamente.',
      });
      this.router.navigate(['/pages/RH/Inventario']);

    }
  }

  agregarServicio() {

    const data = {
      carId: this.carID,
      catServiceCarId: this.nuevoServicio.catServiceCarId,
      km: this.nuevoServicio.km,
      total: this.nuevoServicio.total,
      isService: true
    };
    this.car.addService(data).subscribe(() => {
      Swal.fire('Agregado', 'Servicio agregado correctamente', 'success');
      this.cargarServiciosActuales();
    });
  }

  editarServicio(serv: any) {
    let html = `
 <div style="display: flex; flex-direction: column; gap: 14px; width: 100%; box-sizing: border-box;">
    <div>
      <label style="font-weight: 600; display: block; margin-bottom: 4px;">ID de Servicio:</label>
      <select id="swal-servicio-id" class="swal2-input" style="padding: 10px; font-size: 16px; height: auto;">
        ${this.catServicios.map(opt => `
          <option value="${opt.id}" ${opt.id === serv.catServiceCarId ? 'selected' : ''}>
            ${opt.name}
          </option>
        `).join('')}
      </select>
    </div>
    <div>
      <label style="font-weight: 600; display: block; margin-bottom: 4px;">Kilómetros:</label>
      <input id="swal-servicio-km" type="number" class="swal2-input" style="font-size: 16px;" value="${serv.km}">
    </div>
  </div>
  `;

    Swal.fire({
      title: 'Editar servicio',
      html: html,
      width: 'auto',
      grow: 'row',
      customClass: {
        popup: 'swal-responsive-modal'
      },
      showCancelButton: true,
      confirmButtonText: 'Guardar',
      cancelButtonText: 'Cancelar',
      focusConfirm: false,
      preConfirm: () => {
        const km = (document.getElementById('swal-servicio-km') as HTMLInputElement).value;
        const catServiceCarId = (document.getElementById('swal-servicio-id') as HTMLSelectElement).value;

        if (!km || !catServiceCarId) {
          Swal.showValidationMessage('Todos los campos son obligatorios');
          return;
        }

        return {
          km: Number(km),
          catServiceCarId: Number(catServiceCarId)
        };
      }
    }).then((result) => {
      if (result.isConfirmed && result.value) {
        const payload = {
          carId: this.carID,
          catServiceCarId: result.value.catServiceCarId,
          km: result.value.km,
          isService: false
        };

        this.car.updateService(payload, serv.id).subscribe({
          next: () => {
            Swal.fire('Actualizado', 'El servicio ha sido actualizado.', 'success');
            this.cargarServiciosActuales();
          },
          error: (err) => {
            console.error('Error al actualizar servicio', err);
            Swal.fire('Error', 'No se pudo actualizar el servicio.', 'error');
          }
        });
      }
    });
  }



  confirmarServicio(servicio: any) {
    Swal.fire({
      title: 'Confirmar servicio',
      text: `¿Estás seguro de marcar este servicio como realizado?`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Sí, confirmar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        const data = {
          carId: this.carID,
          catServiceCarId: servicio.catServiceCarId,
          km: servicio.km,
          isService: true
        };

        this.car.updateService(data, servicio.id).subscribe({
          next: () => {
            Swal.fire('Confirmado', 'El servicio fue marcado como realizado.', 'success');
            this.cargarServiciosActuales(); // recargar servicios actuales
            this.cargarHistorialServicios();
          },
          error: (err) => {
            console.error('Error al confirmar servicio', err);
            Swal.fire('Error', 'No se pudo confirmar el servicio.', 'error');
          }
        });
      }
    });
  }


  eliminarServicio(serv: any) {
    this.car.deleteService({}, serv.id).subscribe(() => {
      Swal.fire('Eliminado', 'Servicio eliminado correctamente', 'success');
      this.cargarServiciosActuales();
    });
  }

  cargarServiciosActuales() {
    if (!this.carID) return;
    this.car.getActualService(this.carID).subscribe(res => {
      this.serviciosActuales = res.data;
    });
  }


  cargarHistorialServicios() {
    if (!this.carID) return;
    this.car.getHistoryService(this.carID).subscribe(res => {

      this.historialServicios = res.data;
    });
  }
  // tu guardarDatosPersonales() iría aquí




}






