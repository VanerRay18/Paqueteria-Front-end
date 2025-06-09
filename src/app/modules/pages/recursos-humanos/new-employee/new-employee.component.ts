import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ChangeDetectorRef } from '@angular/core';

@Component({
  selector: 'app-new-employee',
  templateUrl: './new-employee.component.html',
  styleUrls: ['./new-employee.component.css']
})
export class NewEmployeeComponent implements OnInit{

 datosPersonalesForm!: FormGroup;
  direccionForm!: FormGroup;
  empleoForm!: FormGroup;
  pagoForm!: FormGroup;
  emergenciaForm!: FormGroup;
  bermedForm!: FormGroup;
  fotoPreview: string = 'assets/default-user.png'; // Ruta de tu ícono por defecto
  draggedDocumentos: { id: number, name: string } | null = null;
  allDocumentos: { id: number, name: string }[] = [
    { id: 1, name: 'INE' },
    { id: 2, name: 'Comprobante de domicilio' },
    { id: 3, name: 'Licencia' },
    { id: 4, name: 'Tarjeta de circulación' },
    { id: 5, name: 'Contrato' }
  ];

  assignedDocumentos: { id: number, name: string }[] = [
    { id: 1, name: 'INE' },
    { id: 3, name: 'Licencia' }
  ];

  Documentos: number[] = [1, 3];


  constructor(private fb: FormBuilder,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.cdr.detectChanges();
    console.log(this.assignedDocumentos)

    this.datosPersonalesForm = this.fb.group({
      foto: [null],
      nombreCompleto: [''],
      rfc: [''],
      curp: [''],
      fechaNacimiento: [''],
      tipoSeguro: [''],
      telefono: ['']
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

    this.empleoForm = this.fb.group({
      fechaInicio: [''],
      puestoLaboral: [''],
      tipoContratacion: [''],
      entregaIne: [false],
      faltaDomicilio: [false],
      faltaLicencia: [false],
      faltaTarjeta: [false],
      faltaContrato: [false],
      materialEpps: [false],
      materialGorra: [false],
      materialPlayera: [false],
      horario: ['']
    });

    this.pagoForm = this.fb.group({
      clabe: [''],
      tarjeta: [''],
      banco: ['']
    });

    this.emergenciaForm = this.fb.group({
      telefono: [''],
      nombre: ['']
    });

    this.bermedForm = this.fb.group({
      modelo: [''],
      plan: [''],
      telefono: ['']
    });
  }

  // Métodos para enviar cada formulario
  guardarDatosPersonales() {
    console.log(this.datosPersonalesForm.value);
  }

  guardarDireccion() {
    console.log(this.direccionForm.value);
  }

  guardarEmpleo() {
    console.log(this.empleoForm.value);
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
