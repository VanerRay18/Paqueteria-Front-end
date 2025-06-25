import { FileTransferService } from './../../../../services/file-transfer.service';
import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RHService } from 'src/app/services/rh.service';
import { ApiResponse } from 'src/app/models/ApiResponse';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';
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


  constructor(
    private fb: FormBuilder,
    private car: CarsService,
    private router: Router,
    private fileTransferService: FileTransferService,
  ) { }

  ngOnInit(): void {
    this.forms();
    this.fileTransferService.currentIdTercero$
      .pipe(take(1))  // <- solo se ejecuta una vez
      .subscribe(id => {
        if (id !== null) {
          console.log('ID recibido:', id);
          this.carID = id;
          this.isEditMode = true;
          this.loadEmployeeData(id); // solo una vez

          // Limpiar el ID después de usarlo
          this.fileTransferService.clearIdTercero();
        }
      });
    this.getData();

  }

  getData() {
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


  loadEmployeeData(carId: any) {
    if (this.isEditMode) {
      this.car.getCarById(this.carID).subscribe({
        next: (response) => {
          console.log('Datos del vehículo:', response);
          const carData = response.data.car;
          const carTieneDatos = carData && Object.values(carData).some(value => !!value);

          if (!carTieneDatos) return;
          // 👉 Llenar las fotos antiguas
          this.fotosPreview = response.data.images.map((img: any) => {
            const fileName = img.path.split('\\').pop();
            return `http://localhost:3000/uploads/images/${fileName}`; // Ajusta base URL real
          });
          this.fotoActual = 0;

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
        const reader = new FileReader();
        reader.onload = (e: any) => {
          this.fotosPreview.push(e.target.result);
        };
        reader.readAsDataURL(file);
      });

      // 👉 Guardar los archivos para enviar después
      this.fotosSeleccionadas = Array.from(files);

      if (this.fotoActual >= this.fotosPreview.length) {
        this.fotoActual = 0;
      }
    }
  }



  anteriorFoto(): void {
    if (this.fotosPreview.length > 0) {
      this.fotoActual =
        (this.fotoActual - 1 + this.fotosPreview.length) % this.fotosPreview.length;
    }
  }

  siguienteFoto(): void {
    if (this.fotosPreview.length > 0) {
      this.fotoActual = (this.fotoActual + 1) % this.fotosPreview.length;
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
      // 🆕 Modo creación
      this.car.createNewCar(dto).subscribe({
        next: (response) => {
          const carId = response.data;

          if (!carId) {
            Swal.fire({
              icon: 'error',
              title: 'Error',
              text: 'No se pudo obtener el ID del vehículo creado.',
            });
            return;
          }

          this.subirFotos(carId, false);
        },
        error: (err) => {
          console.error('Error al crear vehículo', err);
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Ocurrió un error al guardar los datos del vehículo.',
          });
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
          this.router.navigate(['/pages/RH/Inventario']);
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
  // tu guardarDatosPersonales() iría aquí
}






