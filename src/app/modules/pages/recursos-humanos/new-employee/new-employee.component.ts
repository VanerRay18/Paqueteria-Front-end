import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ChangeDetectorRef } from '@angular/core';
import { RHService } from 'src/app/services/rh.service';
import { ApiResponse } from 'src/app/models/ApiResponse';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';

@Component({
  selector: 'app-new-employee',
  templateUrl: './new-employee.component.html',
  styleUrls: ['./new-employee.component.css']
})
export class NewEmployeeComponent implements OnInit {

  datosPersonalesForm!: FormGroup;
  direccionForm!: FormGroup;
  pagoForm!: FormGroup;
  emergenciaForm!: FormGroup;
  bermedForm!: FormGroup;
  fotoPreview: string = 'assets/default-user.png'; // Ruta de tu ícono por defecto
  draggedDocumentos: { id: number, name: string } | null = null;
  allDocumentos: { id: number, name: string }[] = [];
  assignedDocumentos: { id: number, name: string }[] = [];
  Documentos: number[] = [];
  draggedUniforms: { id: number, name: string } | null = null;
  allUniforms: { id: number, name: string }[] = [];
  assignedUniforms: { id: number, name: string }[] = [];
  uniforms: number[] = [];
  data: any ;
  catDocuments: any[] = [];
  catEmployeeUniforms: any[] = [];
  catEmployments: any[] = [];
  catJobs: any[] = [];
  catSeguros: any[] = [];
  employeeId: any;

  constructor(private fb: FormBuilder,
    private cdr: ChangeDetectorRef,
    private rh: RHService,
    private router: Router
  ) {

   }

  ngOnInit() {
 this.getData();
 this.forms();

  }

  getData() {
    this.rh.getCatalogos().subscribe((response: ApiResponse) => {
      this.data = response.data;
      this.allDocumentos = response.data.catDocuments;
      this.allUniforms = response.data.catEmployeeUniforms;
      this.catJobs = response.data.catJobs;
      this.catSeguros = response.data.catSeguros;
      this.catEmployments = response.data.catEmployments;
      // console.log('Datos obtenidos:', this.data);
    },
      (error) => {
        // console.error('Error al obtener los datos:', error);
        console.error('Ocurrio un error', error);
      });

  }

  forms(){
    this.datosPersonalesForm = this.fb.group({
      foto: [null],
      nombreCompleto: [''],
      rfc: [''],
      curp: [''],
      fechaNacimiento: [''],
      tipoSeguro: [''],
      telefono: [''],
      horarioEnt: [''],
      horarioSal: [''],
      fechaInicio: [''],
      puestoLaboral: [''],
      tipoContratacion: [''],
    });

    this.direccionForm = this.fb.group({
      codigoPostal: [''],
      municipio: [''],
      estado: [''],
      colonia: [''],
      calle: [''],
      numInterior: [''],
      numExterior: ['']
    });

    this.pagoForm = this.fb.group({
      clabe: [''],
      tarjeta: [''],
      banco: ['']
    });

    this.emergenciaForm = this.fb.group({
      contactos: this.fb.array([this.crearContacto()])
    });

    this.bermedForm = this.fb.group({
      telefonos: this.fb.array([this.crearBermed()])
    });
  }

  crearContacto(): FormGroup {
    return this.fb.group({
      telefono: ['', Validators.required],
      nombre: ['', Validators.required],
      parentesco: ['', Validators.required]
    });
  }

  crearBermed(): FormGroup {
    return this.fb.group({
      modelo: ['', Validators.required],
      plan: ['', Validators.required],
      telefono: ['', Validators.required]
    });
  }

  get contactos(): FormArray {
    return this.emergenciaForm.get('contactos') as FormArray;
  }

  get telefonos(): FormArray {
    return this.bermedForm.get('telefonos') as FormArray;
  }

  agregarContacto() {
    this.contactos.push(this.crearContacto());
  }

  agregarBermed() {
    this.telefonos.push(this.crearBermed());
  }

  eliminarContacto(index: number) {
    this.contactos.removeAt(index);
  }

  eliminarBermed(index: number) {
    this.telefonos.removeAt(index);
  }

  separarNombreCompleto(nombreCompleto: string) {
    const partes = nombreCompleto.trim().split(' ');
    const name = partes.slice(0, partes.length - 2).join(' ') || '';
    const firstSurname = partes[partes.length - 2] || '';
    const secondSurname = partes[partes.length - 1] || '';
    return { name, firstSurname, secondSurname };
  }

  // Métodos para enviar cada formulario
  guardarDatosPersonales() {
    const formValue = this.datosPersonalesForm.value;

    const { name, firstSurname, secondSurname } = this.separarNombreCompleto(formValue.nombreCompleto);

    const formatHorario = (horaStr: string) => {
      const [hour, minute] = horaStr.split(':');
      return `${hour.padStart(2, '0')}:${minute.padStart(2, '0')}:00`;
    };

    const dto = {
      name,
      firstSurname,
      secondSurname,
      rfc: formValue.rfc,
      curp: formValue.curp,
      nacimiento: new Date(formValue.fechaNacimiento).toISOString(),
      dateStart: new Date(formValue.fechaInicio).toISOString(),
      dateFin: null,
      entrada: formatHorario(formValue.horarioEnt),
      salida: formatHorario(formValue.horarioSal),
      active: true,
      phone: formValue.telefono,
      config: {},
      catJobId: Number(formValue.puestoLaboral),
      catEmploymentId: Number(formValue.tipoContratacion),
      catSeguroId: Number(formValue.tipoSeguro),
    };

    this.rh.createEmployee(dto).subscribe({
      next: (response) => {
        this.employeeId = response.data; // Guarda el ID del empleado creado
        Swal.fire({
          icon: 'success',
          title: 'Datos guardados',
          text: 'Los datos personales fueron guardados correctamente.',
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



  guardarDireccion() {
    const formValue = this.direccionForm.value;

    const dto = {
      cp: formValue.codigoPostal,
      municipio: formValue.municipio,
      estado: formValue.estado,
      colonia: formValue.colonia,
      calle: formValue.calle,
      interior: formValue.numInterior,
      exterior: formValue.numExterior,
    };

    // console.log(dto);

    this.rh.createAdress(dto, this.employeeId).subscribe({
      next: (response) => {
        Swal.fire({
          icon: 'success',
          title: 'Datos guardados',
          text: 'Los datos personales fueron guardados correctamente.',
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

  guardarEmpleo() {

    const documents = this.Documentos;
    const uniforms = this.uniforms;

    this.rh.SaveDocuments(documents, this.employeeId).subscribe({
      next: (response) => {
        console.log(documents);
        Swal.fire({
          icon: 'success',
          title: 'Documentos guardados',
          text: 'Los documentos fueron guardados correctamente.',
        });
      },
      error: (err) => {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Ocurrió un error al guardar los documentos.',
        });
        console.error(err);
      }
    });
    this.rh.SaveUniforms(uniforms, this.employeeId).subscribe({
      next: (response) => {
        console.log(uniforms);
        Swal.fire({
          icon: 'success',
          title: 'Documentos guardados',
          text: 'Los documentos fueron guardados correctamente.',
        });
      },
      error: (err) => {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Ocurrió un error al guardar los documentos.',
        });
        console.error(err);
      }
    });

  }

  guardarPago() {
    const formValue = this.pagoForm.value;
    const dto = {
      clabe: formValue.tarjeta,
      cuenta: null,
      banco: formValue.banco,
      interbancaria: formValue.clabe,
    };

    // console.log(dto);

    this.rh.SavePay(dto, this.employeeId).subscribe({
      next: (response) => {
        console.log(dto);
        Swal.fire({
          icon: 'success',
          title: 'Datos guardados',
          text: 'Los datos personales fueron guardados correctamente.',
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

  guardarEmergencia() {
    const contactos = this.emergenciaForm.value.contactos;

    contactos.forEach((contacto: { telefono: string; nombre: string; parentesco: string }) => {
      const dto = {
        number: contacto.telefono,
        name: contacto.nombre,
        relationship: contacto.parentesco,
      };

      console.log('Guardando contacto:', dto);
      const employeeId = 10;

      this.rh.SaveEmergency(dto, employeeId).subscribe({
        next: (response) => {
          Swal.fire({
            icon: 'success',
            title: 'Contacto guardado',
            text: 'Un contacto de emergencia fue guardado correctamente.',
          });
        },
        error: (err) => {
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Ocurrió un error al guardar un contacto.',
          });
          console.error(err);
        }
      });
    });
  }


  guardarBermed() {
    const bermeds = this.bermedForm.value.telefonos;

    bermeds.forEach((entry: { modelo: string; plan: string; telefono: string }) => {
      const dto = {
        modelo: entry.modelo,
        plan: entry.plan,
        telefono: entry.telefono,
      };

      console.log('Guardando bermed:', dto);
      const employeeId = 10;

      this.rh.SavephoneBermed(dto, employeeId).subscribe({
        next: (response) => {
          Swal.fire({
            icon: 'success',
            title: 'Telefono guardado',
            text: 'Un Telefono fue guardado correctamente.',
          });
        },
        error: (err) => {
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Ocurrió un error al guardar el telefono.',
          });
          console.error(err);
        }
      });
    });
  }


  onFotoSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        this.fotoPreview = reader.result as string;
      };
      reader.readAsDataURL(file);
    }
  }
  // Drag functions for uniforms
  onDragStartUniform(event: DragEvent, Uniform: { id: number, name: string }) {
    this.draggedUniforms = Uniform;
    event.dataTransfer?.setData('text/plain', Uniform.name);
  }
  onDropUniform(event: DragEvent, target: 'assigned' | 'all') {
    event.preventDefault();
    const Uniform = this.draggedUniforms;
    if (Uniform) {
      if (target === 'assigned') {
        if (!this.assignedUniforms.some(r => r.id === Uniform.id)) {
          this.assignedUniforms.push(Uniform);
          this.uniforms.push(Uniform.id); // Agrega el ID al arreglo uniforms
          this.allUniforms = this.allUniforms.filter(r => r.id !== Uniform.id);
        }
      } else {
        this.assignedUniforms = this.assignedUniforms.filter(r => r.id !== Uniform.id);
        this.uniforms = this.uniforms.filter(id => id !== Uniform.id); // Remueve el ID del arreglo uniforms
        this.allUniforms.push(Uniform);
      }
      this.draggedUniforms = null;
    }
  }
  onDragOverUniform(event: DragEvent) {
    event.preventDefault();
  }
  // Drag functions for documentos

  onDragStart(event: DragEvent, Documento: { id: number, name: string }) {
    this.draggedDocumentos = Documento;
    event.dataTransfer?.setData('text/plain', Documento.name);
  }

  onDrop(event: DragEvent, target: 'assigned' | 'all') {
    event.preventDefault();
    const Documentos = this.draggedDocumentos;

    if (Documentos) {
      if (target === 'assigned') {
        if (!this.assignedDocumentos.some(r => r.id === Documentos.id)) {
          this.assignedDocumentos.push(Documentos);
          this.Documentos.push(Documentos.id); // Agrega el ID al arreglo roles
          this.allDocumentos = this.allDocumentos.filter(r => r.id !== Documentos.id);
        }
      } else {
        this.assignedDocumentos = this.assignedDocumentos.filter(r => r.id !== Documentos.id);
        this.Documentos = this.Documentos.filter(id => id !== Documentos.id); // Remueve el ID del arreglo roles
        this.allDocumentos.push(Documentos);
      }
      this.draggedDocumentos = null;
    }
  }

  onDragOver(event: DragEvent) {
    event.preventDefault();
  }

  saveAll() {

    // Swal.fire({
    //   icon: 'success',
    //   title: 'Empleado guardado',
    //   text: 'El empleado fue guardado correctamente.',
    // });

    this.router.navigate(['/pages/RH/Trabajadores-Registrados']);

  }


}
