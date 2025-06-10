import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ChangeDetectorRef } from '@angular/core';
import { RHService } from 'src/app/services/rh.service';
import { ApiResponse } from 'src/app/models/ApiResponse';

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
  catJobs: any[] = [];
  catSeguros: any[] = [];

  constructor(private fb: FormBuilder,
    private cdr: ChangeDetectorRef,
    private rh: RHService
  ) {
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

  ngOnInit() {
    this.cdr.detectChanges();
    console.log(this.assignedDocumentos)
this.getData();

  }

  getData() {
    this.rh.getCatalogos().subscribe((response: ApiResponse) => {
      this.data = response.data;
      this.allDocumentos = response.data.catDocuments;
      this.allUniforms = response.data.catEmployeeUniforms;
      this.catJobs = response.data.catJobs;
      this.catSeguros = response.data.seguros;
      console.log('Datos obtenidos:', this.data);
    },
      (error) => {
        // console.error('Error al obtener los datos:', error);
        console.error('Ocurrio un error', error);
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


  // Métodos para enviar cada formulario
  guardarDatosPersonales() {
    console.log(this.datosPersonalesForm.value);
  }

  guardarDireccion() {
    console.log(this.direccionForm.value);
  }

  guardarEmpleo() {

  }

  guardarPago() {
    console.log(this.pagoForm.value);
  }

  guardarEmergencia() {
    console.log(this.emergenciaForm.value);
  }

  guardarBermed() {
    console.log(this.bermedForm.value);
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



}
