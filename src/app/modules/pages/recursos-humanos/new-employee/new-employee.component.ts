import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ChangeDetectorRef } from '@angular/core';
import { RHService } from 'src/app/services/rh.service';
import { ApiResponse } from 'src/app/models/ApiResponse';
import Swal from 'sweetalert2';
import { ActivatedRoute, Router } from '@angular/router';
import { FileTransferService } from 'src/app/services/file-transfer.service';
import { take } from 'rxjs/operators';
import { AbstractControl, ValidationErrors } from '@angular/forms';

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
  fotoPreview: string = ''; // Ruta de tu ícono por defecto
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
  employeeIdPatch!: any;
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
  selectedFotoFile: File | null = null;
  fotoAntiguaId: number | null = null;   // El id de la foto actual (si la hay)
  fotoAntigua: any;


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
    private route: ActivatedRoute,
    private fileTransferService: FileTransferService
  ) {

  }

  ngOnInit() {
    this.forms();
    let id = this.route.snapshot.paramMap.get('id') ? Number(this.route.snapshot.paramMap.get('id')) : 0;
    if (id !== 0) {
      this.employeeIdPatch = id
      this.isEditMode = true;
      this.loadEmployeeData(this.employeeIdPatch);
    }

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

  nombreCompletoValidator(control: AbstractControl): ValidationErrors | null {
    const value = control.value as string;
    if (!value) return { requerido: true };

    const partes = value.trim().split(/\s+/);
    if (partes.length < 3) {
      return { nombreCompletoInvalido: 'Debe incluir nombre y dos apellidos' };
    }

    // Opcional: validar que cada parte tenga al menos 2 caracteres
    for (const parte of partes) {
      if (parte.length < 2) {
        return { nombreCompletoInvalido: 'Cada nombre/apellido debe tener al menos 2 letras' };
      }
    }

    return null; // válido
  }


  esFormularioRealmenteVacio(formGroup: FormGroup): boolean {
    return Object.values(formGroup.value).every(valor =>
      valor === null || valor === undefined || valor === ''
    );
  }

  forms() {
    this.datosPersonalesForm = this.fb.group({
      foto: [null],
      nombreCompleto: ['', [Validators.required, this.nombreCompletoValidator]],
      rfc: ['', [Validators.required, Validators.pattern(/^([A-ZÑ&]{3,4})\d{6}[A-Z0-9]{3}$/i)]],
      curp: ['', [Validators.required, Validators.pattern(/^([A-Z]{4})(\d{6})([HM]{1})([A-Z]{5})([A-Z\d]{2})$/i)]],
      fechaNacimiento: ['', Validators.required],
      tipoSeguro: ['', Validators.required],
      telefono: ['', [Validators.required, Validators.pattern(/^[0-9]{10}$/)]],
      horarioEnt: ['', Validators.required],
      horarioSal: ['', Validators.required],
      fechaInicio: ['', Validators.required],
      puestoLaboral: ['', Validators.required],
      tipoContratacion: ['', Validators.required],
      activo: [true, Validators.required],
      usaChecador: [true, Validators.required]
    });

    // Agregar los días de la semana al formulario
    this.diasSemana.forEach(dia => {
      this.datosPersonalesForm.addControl(dia.nombre, this.fb.control(dia.checked));
    });

    this.direccionForm = this.fb.group({
      codigoPostal: ['', [Validators.required, Validators.pattern(/^[0-9]{5}$/)]],
      municipio: ['', [Validators.required, Validators.minLength(3)]],
      estado: ['', [Validators.required, Validators.minLength(3)]],
      colonia: ['', [Validators.required]],
      calle: ['', [Validators.required]],
      numInterior: ['', [Validators.required]],
      numExterior: ['', [Validators.required]]
    });

    this.pagoForm = this.fb.group({
      clabe: ['', [Validators.required, Validators.pattern(/^\d{18}$/)]],
      tarjeta: ['', [Validators.required, Validators.pattern(/^\d{16}$/)]],
      banco: ['', Validators.required]
    });

    this.emergenciaForm = this.fb.group({
      contactos: this.fb.array([this.crearContacto()])
    });

    this.bermedForm = this.fb.group({
      telefonos: this.fb.array([this.crearBermed()])
    });
  }

  getDiasNoSeleccionados(): number[] {
    return this.diasSemana
      .filter(dia => {
        // lee el valor actual desde el formulario para este día
        const valorControl = this.datosPersonalesForm.get(dia.nombre)?.value;
        return !valorControl;
      })
      .map(dia => dia.valor);
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

  getImageUrl(imagePath: string): string {
    if (!imagePath) return '';
    // Extrae el nombre de archivo desde la ruta local
    const filename = imagePath;
    return `http://localhost:8080/${filename}`;
  }

  // 2️⃣ Método para cargar datos existentes y llenar los formularios
  loadEmployeeData(id: number) {
    this.rh.getEmployeeById(id).subscribe((resp: ApiResponse) => {
      console.log('Datos del empleado:', resp.data);
      const e = resp.data.dataUser;
      // console.log('Datos del empleado:', resp.data);
      const personalesTieneDatos = e && Object.values(e).some(value => !!value);
      const diasNoSeleccionados: number[] = e?.config?.attendanceExeption ?? [];
      this.fotoAntiguaId = resp.data.images.id;
      // Obtener URL pública de la imagen si existe
      const paths = resp?.data?.images?.path;

      if (Array.isArray(paths) && paths.length > 0) {
        const imgData = paths[0];
        console.log('Imagen del empleado:', imgData);
        this.fotoAntigua = this.getImageUrl(imgData);
      } else {
        console.log('No hay imágenes disponibles o path está vacío');
        this.fotoAntigua = ''; // valor por defecto
      }

      console.log('Foto antigua:', this.fotoAntigua);
      this.diasSemana = this.diasSemana.map(dia => ({
        ...dia,
        checked: !diasNoSeleccionados.includes(dia.valor)
      }));

      this.diasSemana.forEach(dia => {
        const control = this.datosPersonalesForm.get(dia.nombre);
        if (control) {
          control.setValue(dia.checked);
        }
      });

      // Asume que resp.data trae los campos necesarios
      this.datosPersonalesForm.patchValue({
        nombreCompleto: `${e?.name || ''} ${e?.firstSurname || ''} ${e?.secondSurname || ''}`.trim(),
        rfc: e?.rfc || '',
        curp: e?.curp || '',
        fechaNacimiento: e?.nacimiento ? new Date(e.nacimiento).toISOString().slice(0, 10) : '',
        tipoSeguro: e?.catSeguroId,
        telefono: e?.phone || '',
        horarioEnt: this.formatHoraArray(e?.entrada),
        horarioSal: this.formatHoraArray(e?.salida),
        activo: e?.active ?? true,
        usaChecador: e?.isAttendance ?? true,
        fechaInicio: e?.dateStart ? new Date(e.dateStart).toISOString().slice(0, 10) : '',
        puestoLaboral: e?.catEmploymentId,
        tipoContratacion: e?.catJobId
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
      active: formValue.activo,
      phone: formValue.telefono,
      config: {
        attendanceExeption: noSeleccionados.length > 0 ? noSeleccionados : []
      },
      isAttendance: formValue.usaChecador,
      catJobId: Number(formValue.puestoLaboral),
      catEmploymentId: Number(formValue.tipoContratacion),
      catSeguroId: Number(formValue.tipoSeguro),
    };

    if (this.isEditMode && this.employeeIdPatch) {
      // 🟡 EDICIÓN
      this.rh.UpdateEmployee(dto, this.employeeIdPatch).subscribe({
        next: () => {
          const subirFoto = () => {
            if (this.selectedFotoFile) {
              const formData = new FormData();
              formData.append('file', this.selectedFotoFile);
              this.rh.SaveFoto(formData, '', this.employeeIdPatch, 'employee').subscribe({
                next: () => {
                  Swal.fire('Actualizado', 'Empleado y foto actualizados correctamente.', 'success');

                },
                error: () => {
                  Swal.fire('Advertencia', 'Empleado actualizado, pero hubo un error al subir la foto.', 'warning');

                }
              });
            } else {
              Swal.fire('Actualizado', 'Empleado actualizado correctamente.', 'success');
            }
          };

          if (this.fotoAntiguaId) {
            this.rh.deleteFile([this.fotoAntiguaId]).subscribe({
              next: subirFoto,
              error: (err) => {
                console.error('Error al eliminar foto antigua', err);
                subirFoto();
              }
            });
          } else {
            subirFoto();
          }
        },
        error: () => {
          Swal.fire('Error', 'Ocurrió un error al actualizar los datos.', 'error');
        }
      });

    } else {
      // 🟢 CREACIÓN
      this.rh.createEmployee(dto).subscribe({
        next: (response) => {
          this.employeeId = response.data;

          if (this.selectedFotoFile) {
            const formData = new FormData();
            formData.append('file', this.selectedFotoFile);
            console.log(this.employeeIdPatch);
            this.rh.SaveFoto(formData, '', this.employeeId, 'employee').subscribe({
              next: () => {
                Swal.fire('Guardado', 'Empleado y foto registrados correctamente.', 'success');
              },
              error: () => {
                Swal.fire('Advertencia', 'Empleado guardado, pero hubo un error al subir la foto.', 'warning');
              }
            });
          } else {
            Swal.fire('Guardado', 'Empleado registrado correctamente.', 'success');
          }
        },
        error: () => {
          Swal.fire('Error', 'Ocurrió un error al guardar los datos.', 'error');
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
      this.selectedFotoFile = file; // 🔴 Guarda el archivo para usar después

      // Vista previa
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

  validarSeccionesAntesDeAvanzar(): boolean {
    if (this.datosPersonalesForm.invalid) {
      Swal.fire('Atención', 'Completa la sección de datos personales antes de continuar.', 'warning');
      return false;
    }

    if (this.direccionForm.invalid) {
      Swal.fire('Atención', 'Completa la sección de dirección antes de continuar.', 'warning');
      return false;
    }

    if (this.pagoForm.invalid) {
      Swal.fire('Atención', 'Completa la sección de datos de pago antes de continuar.', 'warning');
      return false;
    }

    if (this.emergenciaForm.invalid) {
      Swal.fire('Atención', 'Completa la sección de contacto de emergencia antes de continuar.', 'warning');
      return false;
    }

    if (this.bermedForm.invalid) {
      Swal.fire('Atención', 'Completa la sección de teléfonos BERMED antes de finalizar.', 'warning');
      return false;
    }

    return true;
  }


  saveAll() {
    if (!this.validarSeccionesAntesDeAvanzar()) return;
    Swal.fire({
      icon: 'success',
      title: 'Empleado guardado',
      text: 'El empleado fue guardado correctamente.',
    });

    this.router.navigate(['/pages/RH/Trabajadores-Registrados']);

  }


}
