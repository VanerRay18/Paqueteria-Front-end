import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ChangeDetectorRef } from '@angular/core';
import { RHService } from 'src/app/services/rh.service';
import { ApiResponse } from 'src/app/models/ApiResponse';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';
import { FileTransferService } from 'src/app/services/file-transfer.service';
import { take } from 'rxjs/operators';

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
  data: any;
  catDocuments: any[] = [];
  catEmployeeUniforms: any[] = [];
  catEmployments: any[] = [];
  catJobs: any[] = [];
  catSeguros: any[] = [];
  employeeId: any;
  employeeIdPatch!: number | null;
  isEditMode = false;
  isEditDocumentos = false;
  isEditUniformes = false;
  datosDireccionCargados = false;
  datosPersonalesCargados = false;
  datosPagoCargados = false;
  datosEmergenciaCargados = false;
  datosBermedCargados = false;
  datosDocumentosCargados = false;
  datosUniformesCargados = false;

  diasSemana = [
    { nombre: 'Lunes', valor: 1, checked: true },
    { nombre: 'Martes', valor: 2, checked: true },
    { nombre: 'Miércoles', valor: 3, checked: true },
    { nombre: 'Jueves', valor: 4, checked: true },
    { nombre: 'Viernes', valor: 5, checked: true },
    { nombre: 'Sábado', valor: 6, checked: true },
    { nombre: 'Domingo', valor: 7, checked: true },
  ];



  constructor(private fb: FormBuilder,
    private cdr: ChangeDetectorRef,
    private rh: RHService,
    private router: Router,
    private fileTransferService: FileTransferService
  ) {

  }

  ngOnInit() {
    this.forms();

    this.fileTransferService.currentIdTercero$
      .pipe(take(1))  // <- solo se ejecuta una vez
      .subscribe(id => {
        if (id !== null) {
          console.log('ID recibido:', id);
          this.employeeIdPatch = id;
          this.isEditMode = true;
          this.loadEmployeeData(id); // solo una vez

          // Limpiar el ID después de usarlo
          this.fileTransferService.clearIdTercero();
        }
      });

    this.getData();

  }

  getData() {
    this.rh.getCatalogos().subscribe((response: ApiResponse) => {
      this.data = response.data;
      this.allDocumentos = response.data.catDocuments;
      this.allUniforms = response.data.catMaterials;
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

  getDiasNoSeleccionados(): number[] {
    return this.diasSemana
      .filter(dia => !dia.checked)
      .map(dia => dia.valor);
  }

  esFormularioRealmenteVacio(formGroup: FormGroup): boolean {
    return Object.values(formGroup.value).every(valor =>
      valor === null || valor === undefined || valor === ''
    );
  }

  forms() {
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

    this.diasSemana.forEach(dia => {
      this.datosPersonalesForm.addControl(dia.nombre, this.fb.control(dia.checked));
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
  formatHoraArray(horaArray: number[]): string {
    if (!horaArray || horaArray.length < 2) return '';
    const horas = horaArray[0].toString().padStart(2, '0');
    const minutos = horaArray[1].toString().padStart(2, '0');
    return `${horas}:${minutos}`;
  }

  // 2️⃣ Método para cargar datos existentes y llenar los formularios
  loadEmployeeData(id: number) {
    this.rh.getEmployeeById(id).subscribe((resp: ApiResponse) => {
      const e = resp.data.dataUser;
      const personalesTieneDatos = e && Object.values(e).some(value => !!value);
      // Asume que resp.data trae los campos necesarios
      this.datosPersonalesForm.patchValue({
        nombreCompleto: `${e?.name || ''} ${e?.firstSurname || ''} ${e?.secondSurname || ''}`.trim(),
        rfc: e?.rfc || '',
        curp: e?.curp || '',
        fechaNacimiento: e?.nacimiento ? new Date(e.nacimiento).toISOString().slice(0, 10) : '',
        tipoSeguro: e?.catSeguroId != null ? e.catSeguroId.toString() : '',
        telefono: e?.phone || '',
        horarioEnt: this.formatHoraArray(e?.entrada),
        horarioSal: this.formatHoraArray(e?.salida),
        fechaInicio: e?.dateStart ? new Date(e.dateStart).toISOString().slice(0, 10) : '',
        puestoLaboral: e?.catJobId != null ? e.catJobId.toString() : '',
        tipoContratacion: e?.catEmploymentId != null ? e.catEmploymentId.toString() : ''
      });
      this.datosPersonalesForm.disable();
      this.datosPersonalesCargados = personalesTieneDatos;

      const d = resp.data.address;
      const direccionTieneDatos = d && Object.values(d).some(value => !!value);

      this.direccionForm.patchValue({
        codigoPostal: d.cp,
        municipio: d.municipio,
        estado: d.estado,
        colonia: d.colonia,
        calle: d.calle,
        numInterior: d.interior,
        numExterior: d.exterior,
      });
      this.direccionForm.disable();
      this.datosDireccionCargados = direccionTieneDatos;

      const p = resp.data.clabes;
      const pagoTieneDatos = p && Object.values(p).some(value => !!value);

      this.pagoForm.patchValue({
        clabe: p.interbancaria,
        tarjeta: p.clabe,
        banco: p.banco,
      });
      this.pagoForm.disable();
      this.datosPagoCargados = pagoTieneDatos;

      const contactos = resp.data.emergencyContacts;
      const emergenciaTieneDatos = contactos && contactos.length > 0;

      // ⛑️ Asegura que es un arreglo
      if (Array.isArray(contactos)) {
        const contactosArray: FormArray = this.fb.array([]); // explícitamente un FormArray

        contactos.forEach((c: any) => {
          const contactoGroup: FormGroup = this.fb.group({
            telefono: [c.number, Validators.required],
            nombre: [c.name, Validators.required],
            parentesco: [c.relationship, Validators.required],
          });

          contactosArray.push(contactoGroup); // ✅ Se agrega como FormGroup
        });

        // 🧠 Aquí reemplazas el formArray existente por el nuevo
        this.emergenciaForm.setControl('contactos', contactosArray);
      }
      this.emergenciaForm.disable();
      this.datosEmergenciaCargados = emergenciaTieneDatos;

      const telefonos = resp.data.phonesBedmer;
      const telefonosTieneDatos = telefonos && telefonos.length > 0;

      // ⛑️ Asegura que es un arreglo
      if (Array.isArray(telefonos)) {
        const telefonosArray: FormArray = this.fb.array([]);

        telefonos.forEach((t: any) => {
          const telefonoGroup: FormGroup = this.fb.group({
            modelo: [t.modelo, Validators.required],
            plan: [t.plan, Validators.required],
            telefono: [t.telefono, Validators.required],
          });

          telefonosArray.push(telefonoGroup);
        });

        // 🧠 Reemplaza el formArray actual en el formulario bermedForm
        this.bermedForm.setControl('telefonos', telefonosArray);
      }
      this.bermedForm.disable();
      this.datosBermedCargados = telefonosTieneDatos;
      // 📄 Documentos entregados
      const docs = resp.data.catDocuments || [];
      this.assignedDocumentos = docs;
      this.Documentos = docs.map((d: any) => d.id);
      this.allDocumentos = this.allDocumentos.filter(d => !this.Documentos.includes(d.id));

      // ✅ Marcar como "editando" si hay al menos un documento
      this.datosDocumentosCargados = docs.length > 0;


      // 👕 Uniformes entregados
      const unis = resp.data.catEmployeeUniforms || [];
      this.assignedUniforms = unis;
      this.uniforms = unis.map((u: any) => u.id);
      this.allUniforms = this.allUniforms.filter(u => !this.uniforms.includes(u.id));

      // ✅ Marcar como "editando" si hay al menos un uniforme
      this.datosUniformesCargados = unis.length > 0;

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
    this.datosPersonalesForm.enable()
    const formValue = this.datosPersonalesForm.value;

    const { name, firstSurname, secondSurname } = this.separarNombreCompleto(formValue.nombreCompleto);
    const noSeleccionados = this.getDiasNoSeleccionados();
    console.log('Días no seleccionados:', noSeleccionados);

    const formatHorario = (horaStr: string) => {
      if (!horaStr) return null;
      const [hour, minute] = horaStr.split(':');
      return `${hour.padStart(2, '0')}:${minute.padStart(2, '0')}:00`;
    };

    const dto = {
      name,
      firstSurname,
      secondSurname,
      rfc: formValue.rfc,
      curp: formValue.curp,
      nacimiento: formValue.fechaNacimiento ? new Date(formValue.fechaNacimiento).toISOString() : null,
      dateStart: formValue.fechaInicio ? new Date(formValue.fechaInicio).toISOString() : null,
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

    if (this.isEditMode && this.employeeIdPatch) {
      // 🟡 Modo edición
      this.rh.UpdateEmployee(dto, this.employeeIdPatch).subscribe({
        next: () => {
          Swal.fire({
            icon: 'success',
            title: 'Datos actualizados',
            text: 'La información fue editada correctamente.',
          });
        },
        error: (err) => {
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Ocurrió un error al actualizar los datos.',
          });
          console.error(err);
        }
      });
    } else {
      // 🟢 Modo creación
      this.rh.createEmployee(dto).subscribe({
        next: (response) => {
          this.employeeId = response.data;
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
  }

  editarDatosPersonales() {
    if (this.employeeIdPatch) {
      this.isEditMode = true;

      this.datosPersonalesForm.enable();
      Swal.fire('Edición activada', 'Puedes modificar los datos y volver a guardar.', 'info');
    }
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

    const idEmpleado = this.employeeId || this.employeeIdPatch;

    if (!idEmpleado) {
      Swal.fire('Error', 'No se pudo determinar el ID del empleado.', 'error');
      return;
    }

    const request$ = this.datosDireccionCargados
      ? this.rh.UpdateAddress(dto, idEmpleado)
      : this.rh.createAdress(dto, idEmpleado);

    request$.subscribe({
      next: () => {
        Swal.fire('Dirección guardada', 'La información fue procesada correctamente.', 'success');
        this.direccionForm.disable();
      },
      error: (err) => {
        Swal.fire('Error', 'Ocurrió un error al guardar la dirección.', 'error');
        console.error(err);
      }
    });
  }


  editarDireccion() {
    if (this.employeeIdPatch) {
      this.isEditMode = true;
      this.direccionForm.enable();
      Swal.fire('Edición activada', 'Puedes modificar los datos y volver a guardar.', 'info');
    }
  }

  guardarEmpleo() {
    const documents = this.Documentos;
    const uniforms = this.uniforms;

    const idEmpleado = this.employeeIdPatch || this.employeeId;

    if (!idEmpleado) {
      Swal.fire('Error', 'No se pudo determinar el ID del empleado.', 'error');
      return;
    }

    const documentos$ = this.datosDocumentosCargados
      ? this.rh.UpdateDocuments(documents, idEmpleado)
      : this.rh.SaveDocuments(documents, idEmpleado);
    documentos$.subscribe({
      next: () => {
        Swal.fire('Documentos guardados', 'Se guardaron correctamente.', 'success');
        this.isEditDocumentos = false;
      },
      error: (err) => {
        Swal.fire('Error', 'Ocurrió un error al guardar los documentos.', 'error');
        console.error(err);
      }
    });

    if (!idEmpleado) {
      Swal.fire('Error', 'No se pudo determinar el ID del empleado.', 'error');
      return;
    }

    const uniforms$ = this.datosUniformesCargados
      ? this.rh.UpdateUniforms(uniforms, idEmpleado)
      : this.rh.SaveUniforms(uniforms, idEmpleado);

    uniforms$.subscribe({
      next: () => {
        Swal.fire('Uniformes guardados', 'Se guardaron correctamente.', 'success');
        this.isEditUniformes = false;
      },
      error: (err) => {
        Swal.fire('Error', 'Ocurrió un error al guardar los uniformes.', 'error');
        console.error(err);
      }
    });
  }


  editarEmpleo() {
    if (this.employeeIdPatch) {
      this.isEditMode = true;
      Swal.fire('Edición activada', 'Puedes modificar los datos y volver a guardar.', 'info');
    }
  }

  guardarPago() {
    const formValue = this.pagoForm.value;
    const dto = {
      clabe: formValue.tarjeta,
      cuenta: null,
      banco: formValue.banco,
      interbancaria: formValue.clabe,
    };

    const idEmpleado = this.employeeIdPatch || this.employeeId;

    if (!idEmpleado) {
      Swal.fire('Error', 'No se pudo determinar el ID del empleado.', 'error');
      return;
    }

    const request$ = this.datosPagoCargados
      ? this.rh.UpdatePay(dto, idEmpleado)
      : this.rh.SavePay(dto, idEmpleado);


    request$.subscribe({
      next: () => {
        Swal.fire('Pago guardado', 'La información fue procesada correctamente.', 'success');
        this.pagoForm.disable();
      },
      error: (err) => {
        Swal.fire('Error', 'Ocurrió un error al guardar el pago.', 'error');
        console.error(err);
      }
    });
  }

  editarPago() {
    if (this.employeeIdPatch) {
      this.isEditMode = true;
      this.pagoForm.enable();
      Swal.fire('Edición activada', 'Puedes modificar los datos y volver a guardar.', 'info');
    }
  }

  guardarEmergencia() {
    const contactos = this.emergenciaForm.value.contactos;

    contactos.forEach((contacto: any) => {
      const dto = {
        number: contacto.telefono,
        name: contacto.nombre,
        relationship: contacto.parentesco,
      };

      const idEmpleado = this.employeeIdPatch || this.employeeId;

      if (!idEmpleado) {
        Swal.fire('Error', 'No se pudo determinar el ID del empleado.', 'error');
        return;
      }

      const request$ = this.datosEmergenciaCargados
        ? this.rh.UpdateEmergency(dto, idEmpleado)
        : this.rh.SaveEmergency(dto, idEmpleado);

      request$.subscribe({
        next: () => {
          Swal.fire('Contacto guardado', 'Un contacto fue guardado correctamente.', 'success');
        },
        error: (err) => {
          Swal.fire('Error', 'Ocurrió un error al guardar el contacto.', 'error');
          console.error(err);
        }
      });
    });

    this.emergenciaForm.disable();
  }

  editarEmergencia() {
    if (this.employeeIdPatch) {
      this.isEditMode = true;
      this.emergenciaForm.enable();
      Swal.fire('Edición activada', 'Puedes modificar los datos y volver a guardar.', 'info');
    }

  }


  guardarBermed() {
    const bermeds = this.bermedForm.value.telefonos;

    bermeds.forEach((entry: any) => {
      const dto = {
        modelo: entry.modelo,
        plan: entry.plan,
        telefono: entry.telefono,
      };
      const idEmpleado = this.employeeIdPatch || this.employeeId;

      if (!idEmpleado) {
        Swal.fire('Error', 'No se pudo determinar el ID del empleado.', 'error');
        return;
      }

      const request$ = this.datosBermedCargados
        ? this.rh.UpdatePhoneBermed(dto, idEmpleado)
        : this.rh.SavephoneBermed(dto, idEmpleado);

      request$.subscribe({
        next: () => {
          Swal.fire('Teléfono guardado', 'Un teléfono fue guardado correctamente.', 'success');
        },
        error: (err) => {
          Swal.fire('Error', 'Ocurrió un error al guardar el teléfono.', 'error');
          console.error(err);
        }
      });
    });

    this.bermedForm.disable();
  }

  editarBermed() {
    if (this.employeeIdPatch) {
      this.isEditMode = true;
      this.bermedForm.enable();
      Swal.fire('Edición activada', 'Puedes modificar los datos y volver a guardar.', 'info');
    }
  }

  onFotoSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      // Leer la imagen para mostrar la vista previa
      const reader = new FileReader();
      reader.onload = () => {
        this.fotoPreview = reader.result as string;
      };
      reader.readAsDataURL(file);

      // Crear un FormData para enviar el archivo al backend
      const formData = new FormData();
      formData.append('files', file);

      const idEmpleado = this.employeeIdPatch || this.employeeId;
      if (!idEmpleado) {
        Swal.fire('Error', 'No se pudo determinar el ID del empleado.', 'error');
        return;
      }

      // Llamada al servicio para guardar el archivo
      this.rh.SaveFoto(formData, idEmpleado).subscribe({
        next: (res) => {
          console.log('Archivo subido con éxito', res);
        },
        error: (err) => {
          console.error('Error al subir el archivo', err);
        }
      });
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

    Swal.fire({
      icon: 'success',
      title: 'Empleado guardado',
      text: 'El empleado fue guardado correctamente.',
    });

    this.router.navigate(['/pages/RH/Trabajadores-Registrados']);

  }


}
