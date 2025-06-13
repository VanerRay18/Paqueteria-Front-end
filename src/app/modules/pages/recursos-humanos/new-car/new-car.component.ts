import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RHService } from 'src/app/services/rh.service';
import { ApiResponse } from 'src/app/models/ApiResponse';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';

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

  constructor(
    private fb: FormBuilder,
    private rh: RHService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.forms();
    this.getData();
  }
  getData() { }

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
      responsable: ['']
    });
  }
  onFotoSelected(event: any): void {
    const files: FileList = event.target.files;

    if (files && files.length > 0) {
      // Elimina esta línea:
      // this.fotosPreview = [];

      Array.from(files).forEach((file) => {
        const reader = new FileReader();
        reader.onload = (e: any) => {
          this.fotosPreview.push(e.target.result);
        };
        reader.readAsDataURL(file);
      });

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


  guardarDatosPersonales() {
    const formValue = this.carForm.value;

    const dto = {
      placa: formValue.placa,
      marca: formValue.marca,
      modelo: formValue.modelo,
      vin: formValue.serie,                         // <- "serie" del formulario va a "vin"
      anio: Number(formValue.vigencia),             // <- Usa "vigencia" si ahí tienes el año, o cambia por el campo correcto
      color: formValue.color || '',                 // <- Este campo no está en el form, pero puedes completarlo aquí
      employeeId: Number(formValue.responsable),    // <- "responsable" es el ID del empleado
      active: formValue.estado.activo               // <- Obtienes el booleano desde el grupo "estado"
    };

    // this.rh.createEmployee(dto).subscribe({
    //   next: (response) => {
    //     Swal.fire({
    //       icon: 'success',
    //       title: 'Datos guardados',
    //       text: 'Los datos personales fueron guardados correctamente.',
    //     });
    //   },
    //   error: (err) => {
    //     Swal.fire({
    //       icon: 'error',
    //       title: 'Error',
    //       text: 'Ocurrió un error al guardar los datos.',
    //     });
    //     console.error(err);
    //   }
    // });
  }



}
