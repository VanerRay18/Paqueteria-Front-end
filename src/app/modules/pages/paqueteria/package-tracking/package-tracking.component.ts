import { formatDate } from '@angular/common';
import { HttpHeaders } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import dayjs from 'dayjs';
import * as Papa from 'papaparse';
import { FileTransferService } from 'src/app/services/file-transfer.service';
import { PakageService } from 'src/app/services/pakage.service';
import Swal from 'sweetalert2';
import * as XLSX from 'xlsx';


@Component({
  selector: 'app-package-tracking',
  templateUrl: './package-tracking.component.html',
  styleUrls: ['./package-tracking.component.css']
})
export class PackageTrackingComponent implements OnInit {
  paquetesEsc: string[] = [];
  paqueteActual: string = '';
  incomingPackageId: any; // ID del paquete entrante, puedes cambiarlo según tu lógica
  paquetes: any[] = [];
  isMatch: boolean = false;  // Variable para controlar el disabled
  cargamento: any = null;
  total: number = 0;
  isCreateExel: boolean = false;
  isLoading: boolean = false;
  page: number = 0;
  size: number = 20;


  paquetesAgrupados: any[] = []; // Agrupados y paginados

  constructor(
    private pakage: PakageService,
    private fileTransferService: FileTransferService,
        private route: ActivatedRoute
    
  ) {

  }
  ngOnInit(): void {
    // this.fileTransferService.currentIdTercero$
    //   // <- solo se ejecuta una vez
    //   .subscribe(id => {
    //     if (id !== null) {

    //       this.incomingPackageId = id;

    //     }
    //   });
    this.incomingPackageId = this.route.snapshot.paramMap.get('id');
    this.getData(this.page, this.size);

  }

  cambiarPagina(pagina: number) {
    this.page = pagina;
    this.getData(this.page, this.size);
  }

  renderInput(id: string, value: string = ''): string {
    const safeValue = value ?? ''; // evita undefined
    return `
    <div style="display: flex; flex-direction: column;">
      <label><strong>${id}</strong></label>
      <input id="${id}" class="swal2-input" placeholder="${id}" value="${safeValue}" />
    </div>
  `;
  }

  editarConsolidado(paquete: any): void {
    const esNuevo = !paquete.consolidado;
    const consolidado = paquete.consolidado || {};
    const commitDateValue = consolidado.commitDate
      ? new Date(consolidado.commitDate[0], consolidado.commitDate[1] - 1, consolidado.commitDate[2]).toISOString().split('T')[0]
      : '';

    Swal.fire({
      title: esNuevo ? 'Nuevo Consolidado' : 'Editar Consolidado',
      html: `
      <form id="consolidadoForm" style="display: flex; flex-direction: column; gap: 14px; font-size: 14px; max-height: 60vh; overflow-y: auto; padding-right: 4px;">
    <div style="display: flex; flex-direction: column;">
  <label><strong>commitDate *</strong></label>
      <input
        type="date"
        id="commitDate"
        class="swal2-input"
        placeholder="commitDate"
        value="${commitDateValue}"
        style="${commitDateValue ? '' : 'border: 1px solid #dc2626;'}"
      />
    </div>

        <div style="display: flex; flex-direction: column;">
          <label><strong>Descripcion</strong></label>
          <textarea id="descripcion" class="swal2-textarea" rows="2">${paquete.delivery?.description || ''}</textarea>
        </div>

        ${this.renderInput('trackingNo', consolidado.trackingNo)}
        ${this.renderInput('latestDeptLocation', consolidado.latestDeptLocation)}
        ${this.renderInput('latestDeptCntryCd', consolidado.latestDeptCntryCd)}
        ${this.renderInput('originLocId', consolidado.originLocId)}
        ${this.renderInput('shprCoShprName', consolidado.shprCoShprName)}
        ${this.renderInput('shprAddr', consolidado.shprAddr)}
        ${this.renderInput('shprCity', consolidado.shprCity)}
        ${this.renderInput('shprState', consolidado.shprState)}
        ${this.renderInput('shprCntry', consolidado.shprCntry)}
        ${this.renderInput('shprPostal', consolidado.shprPostal)}
        ${this.renderInput('destinationLocId', consolidado.destinationLocId)}
        ${this.renderInput('recipCo', consolidado.recipCo)}
        ${this.renderInput('recipName', consolidado.recipName)}
        ${this.renderInput('recipAddr', consolidado.recipAddr)}
        ${this.renderInput('recipCity', consolidado.recipCity)}
        ${this.renderInput('recipState', consolidado.recipState)}
        ${this.renderInput('recipCntry', consolidado.recipCntry)}
        ${this.renderInput('recipPostal', consolidado.recipPostal)}
        ${this.renderInput('service', consolidado.service)}
        ${this.renderInput('commitTime', consolidado.commitTime)}
        ${this.renderInput('shprPhone', consolidado.shprPhone)}
        ${this.renderInput('recipPhone', consolidado.recipPhone)}
        ${this.renderInput('shprRef', consolidado.shprRef)}
        ${this.renderInput('noPieces', consolidado.noPieces)}
        ${this.renderInput('masterTrackingNo', consolidado.masterTrackingNo)}
        ${this.renderInput('specialHandlingCodes', consolidado.specialHandlingCodes)}
      </form>
    `,
      showCancelButton: true,
      showCloseButton: true,
      confirmButtonText: 'Guardar',
      cancelButtonText: 'Cancelar',
      focusConfirm: false,
      preConfirm: () => {
        const getVal = (id: string) => (document.getElementById(id) as HTMLInputElement)?.value?.trim() || '';
        const dateStr = getVal('commitDate');
        const recipName = getVal('recipName');

        if (!dateStr || !recipName) {
          Swal.showValidationMessage('Los campos "commitDate" y "recipName" son obligatorios.');
          return;
        }

        const date = new Date(dateStr);

        const body = {
          trackingNo: getVal('trackingNo'),
          latestDeptLocation: getVal('latestDeptLocation'),
          latestDeptCntryCd: getVal('latestDeptCntryCd'),
          originLocId: getVal('originLocId'),
          shprCoShprName: getVal('shprCoShprName'),
          shprAddr: getVal('shprAddr'),
          shprCity: getVal('shprCity'),
          shprState: getVal('shprState'),
          shprCntry: getVal('shprCntry'),
          shprPostal: getVal('shprPostal'),
          destinationLocId: getVal('destinationLocId'),
          recipCo: getVal('recipCo'),
          recipName,
          recipAddr: getVal('recipAddr'),
          recipCity: getVal('recipCity'),
          recipState: getVal('recipState'),
          recipCntry: getVal('recipCntry'),
          recipPostal: getVal('recipPostal'),
          commitDate: `${date.getDate().toString().padStart(2, '0')}/${(date.getMonth() + 1).toString().padStart(2, '0')}/${date.getFullYear()}`,
          service: getVal('service'),
          commitTime: getVal('commitTime'),
          shprPhone: getVal('shprPhone'),
          recipPhone: getVal('recipPhone'),
          shprRef: getVal('shprRef'),
          noPieces: getVal('noPieces'),
          masterTrackingNo: getVal('masterTrackingNo'),
          specialHandlingCodes: getVal('specialHandlingCodes')
        };

        const headers = {
          packageId: paquete.id,
          description: (document.getElementById('descripcion') as HTMLTextAreaElement)?.value || ''
        };

        return { body, headers };
      }
    }).then(result => {
      if (result.isConfirmed && result.value) {
        const { body, headers } = result.value;
        console.log(body);
        console.log(headers);
        console.log(paquete.consolidado.id)
        if (paquete.consolidado.id == null) {
          this.pakage.createPackageWithConsolidado(headers.packageId, headers.description, body).subscribe(
            response => {
              Swal.fire('¡Éxito!', `El consolidado fue ${esNuevo ? 'creado' : 'actualizado'} correctamente.`, 'success');
            },
            error => {
              console.error('Error al obtener los datos:', error);
              this.isLoading = false;
            }
          );
          console.log("is post")
        } else {
          this.pakage.updatePackageWithConsolidado(headers.packageId, headers.description, body).subscribe(
            response => {
              Swal.fire('¡Éxito!', `El consolidado fue ${esNuevo ? 'creado' : 'actualizado'} correctamente.`, 'success');
            },
            error => {
              console.error('Error al obtener los datos:', error);
              this.isLoading = false;
            }
          );

        }
        Swal.fire('¡Éxito!', `El consolidado fue ${esNuevo ? 'creado' : 'actualizado'} correctamente.`, 'success');
        this.getData(this.page, this.size);
      }
    });
  }

  verdetallesPaquete(paquete: any): void {
    const guia = paquete.guia;
    const commitDate = paquete.commit_date
      ? formatDate(new Date(paquete.commit_date[0], paquete.commit_date[1] - 1, paquete.commit_date[2]), 'dd-MM-yyyy', 'en-US')
      : 'Sin fecha';

    const d = paquete.consolidado;
    const s = paquete.status;
    const c = this.cargamento;

    Swal.fire({
      title: `<strong>${guia} - ${commitDate}</strong>`,
      html: `
      <div style="display: flex; flex-direction: column; gap: 1.2rem; font-size: 14px;">

        <!-- Consolidado -->
        <div style="padding: 12px; border-radius: 8px; background: #f1f5f9; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
          <h4 style="margin-bottom: 8px; color: #0f172a;">Consolidado</h4>
          ${d ? `
            <p><strong>Origen:</strong> ${d.originLocId} - ${d.shprCity}, ${d.shprState}</p>
            <p><strong>Destino:</strong> ${d.destinationLocId} - ${d.recipCity}, ${d.recipState}</p>
            <p><strong>Remitente:</strong> ${d.shprCoShprName}</p>
            <p><strong>Destinatario:</strong> ${d.recipName}</p>
            <p><strong>Tel. Remitente:</strong> ${d.shprPhone}</p>
            <p><strong>Tel. Destinatario:</strong> ${d.recipPhone}</p>
            <p><strong>Referencias:</strong> ${d.shprRef}</p>
          ` : `<p>No hay información de consolidado</p>`}
        </div>

        <!-- Status -->
        <div style="padding: 12px; border-radius: 8px; background: #fef9c3; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
          <h4 style="margin-bottom: 8px; color: #78350f;">Estado</h4>
          <p><strong>Nombre:</strong> ${s.name}</p>
          <p><strong>Fecha:</strong> ${s.tiempo ? formatDate(new Date(s.tiempo), 'dd-MM-yyyy HH:mm', 'en-US') : 'N/A'}</p>
        </div>

        <!-- Delivery -->
        <div style="padding: 12px; border-radius: 8px; background: #e0f2fe; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
          <h4 style="margin-bottom: 8px; color: #0369a1;">Ruta</h4>
          ${paquete.delivery ? `
            <p><strong>Descripción:</strong> ${paquete.delivery.description || 'Sin descripción'}</p>
            <p><strong>Auto:</strong> ${paquete.delivery.car.marca} ${paquete.delivery.car.modelo} - ${paquete.delivery.car.placa}</p>
            <p><strong>Empleado:</strong> ${paquete.delivery.employee.name} ${paquete.delivery.employee.firstSurname}</p>
            <p><strong>Creado:</strong> ${paquete.delivery.tsCreated ? formatDate(new Date(paquete.delivery.tsCreated), 'dd-MM-yyyy HH:mm', 'en-US') : 'N/A'}</p>
          ` : `<p>Sin ruta asignada</p>`}
        </div>

        <!-- Cargamento -->
        <div style="padding: 12px; border-radius: 8px; background: #dcfce7; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
          <h4 style="margin-bottom: 8px; color: #065f46;">Cargamento</h4>
          <p><strong>ID:</strong> ${c?.id}</p>
          <p><strong>Descripción:</strong> ${c?.description}</p>
          <p><strong>Empleado:</strong> ${c?.employee.name || 'Sin nombre'} ${c?.employee.firstSurname || 'Sin apellido'}</p>
          <p><strong>Creado:</strong> ${c?.tsCreated ? formatDate(new Date(c.tsCreated), 'dd-MM-yyyy HH:mm', 'en-US') : 'N/A'}</p>
        </div>

      </div>
    `,
      width: 650,
      showCloseButton: true,
      confirmButtonText: 'Cerrar',
      focusConfirm: false,
      customClass: {
        popup: 'custom-swal-popup'
      }
    });
  }

  agruparPorFechaDeEntrega(paquetes: any[]) {
    const agrupados: { [fecha: string]: any[] } = {};

    paquetes.forEach(p => {
      const timestamp = p.commit_date;
      const fecha = timestamp
        ? formatDate(new Date(timestamp), 'dd-MM-yyyy', 'en-US')
        : 'Sin fecha de entrega';

      if (!agrupados[fecha]) agrupados[fecha] = [];
      agrupados[fecha].push(p);
    });

    // Convertimos a array ordenado (opcionalmente por fecha)
    this.paquetesAgrupados = Object.entries(agrupados).map(([fecha, paquetes]) => ({
      fecha,
      paquetes
    }));
  }

  getData(page: number, size: number): void {
    this.isLoading = true;
    this.paquetesAgrupados = [];
    this.pakage.getPackageByCarga(this.incomingPackageId, page, size).subscribe(
      response => {

        this.total = response.data.total
        this.isMatch = response.data.cargamento.isMatch
        this.cargamento = response.data.cargamento
        this.paquetes = response.data.packages; // Asignar los datos recibidos a la variable paquetes
        // console.log(response.data.packages);
        this.agruparPorFechaDeEntrega(this.paquetes);
        this.isLoading = false;
        this.isCreateExel = response.data.cargamento.isExel; // Actualizar el estado de isCreateExel
        console.log('isCreateExel:', this.isCreateExel);
      },
      error => {
        console.error('Error al obtener los datos:', error);
        this.isLoading = false;
      }
    );
  }

  getBarraEstado(paquete: any): string {
    const value = paquete.status.config?.value || 0;
    return value + '%';
  }

  // Ojo para ver detalles
  verDetalles(paquete: any): void {
    const d = paquete.consolidado;
    Swal.fire({
      title: 'Detalles del Paquete',
      html: `
      <div style="text-align: left; font-size: 14px;">
        <p><strong>Guía:</strong> ${paquete.guia}</p>
        <p><strong>Fecha de Entrega:</strong> ${d.serviceCommitDate}</p>
        <p><strong>Origen:</strong> ${d.originLocId ? d.originLocId : ''} - ${d.shprCity}, ${d.shprState}</p>
        <p><strong>Destino:</strong> ${d.destinationLocId} - ${d.recipCity}, ${d.recipState}</p>
        <p><strong>Remitente:</strong> ${d.shprCoShprName}, ${d.shprAddr}</p>
        <p><strong>Destinatario:</strong> ${d.recipName}, ${d.recipAddr}</p>
        <p><strong>Tel. Remitente:</strong> ${d.shprPhone}</p>
        <p><strong>Tel. Destinatario:</strong> ${d.recipPhone}</p>
        <p><strong>Referencias:</strong> ${d.shprRef}</p>
      </div>
    `,
      confirmButtonText: 'Cerrar',
      width: 600
    });
  }

  onFileSelected(event: any): void {
    const file: File = event.target.files[0];

    if (file) {
      const reader: FileReader = new FileReader();
      reader.onload = (e: any) => {
        const data: Uint8Array = new Uint8Array(e.target.result);
        const workbook: XLSX.WorkBook = XLSX.read(data, { type: 'array' });

        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];

        const jsonDataOriginal = XLSX.utils.sheet_to_json(worksheet, {
          defval: '',
          raw: false,
          dateNF: 'mm/dd/yyyy' // Formato de fecha
        });

        const toCamelCase = (str: string) => {
          return str
            .toLowerCase()
            .replace(/[^a-zA-Z0-9 ]/g, '')              // quita caracteres especiales
            .replace(/(?:^\w|[A-Z]|\b\w)/g, (word, index) =>
              index === 0 ? word.toLowerCase() : word.toUpperCase()
            )
            .replace(/\s+/g, '');
        };

        const jsonData = jsonDataOriginal.map((row: any) => {
          const newRow: any = {};

          Object.keys(row).forEach(key => {
            const newKey = toCamelCase(key);
            const value = row[key];

            // Detectar si es una fecha
            if (value instanceof Date || (!isNaN(Date.parse(value)) && typeof value === 'string')) {
              const date = dayjs(value);
              newRow[newKey] = date.isValid() ? date.format('MM/DD/YYYY') : value;
            } else {
              newRow[newKey] = value;
            }
          });

          return newRow;
        });

        // console.log('JSON limpio con títulos en camelCase:', jsonData);
        this.enviarAlBackend(jsonData);
      };


      reader.readAsArrayBuffer(file); // ✅ lee como binario
    }
  }

  // Método para enviar los datos al backend
  enviarAlBackend(data: any): void {
    // console.log(data) // Reemplaza con el ID real del paquete entrante
    Swal.fire({
      title: 'Cargando consolidado...',
      html: '<b>Por favor espera</b>',
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading(); // icono de carga
      }
    });
    this.pakage.SentDataExel(data, this.incomingPackageId).subscribe(
      response => {
        // console.log(response.data);
        this.getData(this.page, this.size); // Actualiza la lista después de enviar los datos
        Swal.fire({
          title: '¡Éxito!',
          text: 'Se cargo el consolidado correctamente.',
          icon: 'success',
          showConfirmButton: false,
          timer: 1500,
          timerProgressBar: true
        });
      }
    );


    //     console.log('Enviando datos al backend:', data);
    //     // Aquí puedes usar un servicio HTTP para enviar los datos
  }

  mostrarSwal(): void {
    this.paquetesEsc = [];

    const headers = new HttpHeaders({ 'incomingPackageId': this.incomingPackageId });

    this.pakage.getConfigPackageOrg(headers).subscribe({
      next: (response) => {
        const { minvalue, maxvalue } = response.data.config;

        Swal.fire({
          title: 'Comience a escanear los paquetes',
          html: `
        <input id="input-paquete" class="swal2-input" placeholder="Escanea o escribe el paquete" autofocus>
        <div id="lista-paquetes" style="
          max-height: 250px;
          overflow-y: auto;
          text-align: left;
          font-weight: 500;
          font-family: sans-serif;
          margin-top: 1rem;"></div>
      `,
          showCancelButton: true,
          confirmButtonText: 'Guardar',
          cancelButtonText: 'Cancelar',
          allowOutsideClick: false,
          preConfirm: () => {
            // Validación final antes de enviar
            if (this.paquetesEsc.length === 0) {
              Swal.showValidationMessage('Debes escanear al menos un paquete.');
              return false;
            }
            return this.paquetesEsc;
          },
          didOpen: () => {
            const input = document.getElementById('input-paquete') as HTMLInputElement;
            const lista = document.getElementById('lista-paquetes');
            let debounceTimer: any;

            const renderLista = () => {
              if (!lista) return;
              lista.innerHTML = this.paquetesEsc.map((p, i) =>
                `<div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 6px; padding: 4px 8px; border: 1px solid #ccc; border-radius: 6px;">
              <span>${p}</span>
              <button style="border: none; background: transparent; font-size: 16px; cursor: pointer; color: #b91c1c;"
                onclick="document.dispatchEvent(new CustomEvent('quitar-paquete', { detail: ${i} }))">✖</button>
            </div>`
              ).join('');
            };

            const agregarPaquete = (paquete: string) => {
              if (paquete.length < minvalue) {
                Swal.showValidationMessage(`❌ El paquete debe tener al menos ${minvalue} caracteres.`);
                return;
              }

              const recortado = paquete.length > maxvalue
                ? paquete.substring(0, maxvalue)
                : paquete;

              if (this.paquetesEsc.includes(recortado)) {
                Swal.showValidationMessage(`⚠️ El paquete "${recortado}" ya fue escaneado.`);
                return;
              }

              this.paquetesEsc.push(recortado);
              renderLista();
            };


            input.addEventListener('input', () => {
              if (debounceTimer) clearTimeout(debounceTimer);
              debounceTimer = setTimeout(() => {
                const valor = input.value.trim();
                if (valor) {
                  agregarPaquete(valor);
                  input.value = '';
                }
              }, 600);
            });

            document.addEventListener('quitar-paquete', (e: any) => {
              const index = e.detail;
              this.paquetesEsc.splice(index, 1);
              renderLista();
            });

            input.focus();
          }
        }).then((result) => {
          if (result.isConfirmed && result.value?.length > 0) {
            // ✅ Enviar al backend todos los paquetes escaneados

            Swal.fire({
              title: 'Enviando paquetes...',
              html: 'Por favor espera mientras se procesan los datos.',
              allowOutsideClick: false,
              didOpen: () => {
                Swal.showLoading();
              }
            });

            this.pakage.paquetesEscaneados(this.paquetesEsc, this.incomingPackageId).subscribe({
              next: () => {
                Swal.fire('¡Éxito!', 'Los paquetes fueron enviados correctamente.', 'success');
                this.getData(this.page, this.size);
              },
              error: () => {
                Swal.fire('Error', 'No se pudieron guardar los paquetes.', 'error');
              }
            });
          }
        });
      },
      error: (err) => {
        console.error('Error al obtener configuración de longitud:', err);
        Swal.fire('Error', 'No se pudo cargar la configuración de escaneo.', 'error');
      }
    });
  }




  machoteExelPaquetes() {
    const headers = [
      'Tracking No',
      'Latest Dept Location',
      'Latest Dept Cntry Cd',
      'Origin Loc ID',
      'Shpr Co',
      'Shpr Name',
      'Shpr Addr',
      'Shpr City',
      'Shpr State',
      'Shpr Cntry',
      'Shpr Postal',
      'Destination Loc ID',
      'Recip Co',
      'Recip Name',
      'Recip Addr',
      'Recip City',
      'Recip State',
      'Recip Cntry',
      'Recip Postal',
      'Service',
      'Commit Date',
      'Commit Time',
      'Shpr Phone',
      'Recip Phone',
      'Shpr Ref',
      'No Pieces',
      'Master Tracking No',
      'Special Handling Codes'
    ];

    const data = this.paquetes.map(p => {
      const d = p.consolidado || {};
      return {
        'Tracking No': d.trackingNo || p.guia || '',
        'Latest Dept Location': '',
        'Latest Dept Cntry Cd': '',
        'Origin Loc ID': '',
        'Shpr Co': '',
        'Shpr Name': '',
        'Shpr Addr': '',
        'Shpr City': '',
        'Shpr State': '',
        'Shpr Cntry': '',
        'Shpr Postal': '',
        'Destination Loc ID': '',
        'Recip Co': '',
        'Recip Name': '',
        'Recip Addr': '',
        'Recip City': '',
        'Recip State': '',
        'Recip Cntry': '',
        'Recip Postal': '',
        'Service': '',
        'Commit Date': '',
        'Commit Time': '',
        'Shpr Phone': '',
        'Recip Phone': '',
        'Shpr Ref': '',
        'No Pieces': '',
        'Master Tracking No': '',
        'Special Handling Codes': ''
      };
    });

    const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(data, { header: headers });
    const workbook: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Paquetes');

    XLSX.writeFile(workbook, `Machote_Paquetes_${this.incomingPackageId}.xlsx`);

    // Aquí puedes usar un servicio para generar el archivo Excel
  }

  descargarTxtDeGuiasPorBloques(): void {
    const guias: string[] = this.paquetes
      .map(p => p.consolidado?.trackingNo || p.guia || '')
      .filter(Boolean);

    const bloques: string[] = [];
    for (let i = 0; i < guias.length; i += 30) {
      bloques.push(guias.slice(i, i + 30).join(', '));
    }

    let paginaActual = 0;

    const mostrarPagina = (index: number) => {
      const contenido = bloques[index] || '';

      Swal.fire({
        title: `Guías (bloque ${index + 1} de ${bloques.length})`,
        html: `
        <div style="max-height: 250px; overflow-y: auto; background: #f9fafb; padding: 12px; font-family: monospace; border-radius: 6px; border: 1px solid #ddd;">
          <span id="bloqueTexto">${contenido}</span>
        </div>
        <div style="margin-top: 12px; display: flex; justify-content: space-between; align-items: center;">
          <button id="anteriorBtn" class="swal2-styled swal2-default btn-navegacion" ${index === 0 ? 'disabled' : ''}>◀ Anterior</button>
          <button id="copiarBtn" class="swal2-styled swal2-confirm btn-copiar">📋 Copiar</button>
          <button id="siguienteBtn" class="swal2-styled swal2-default btn-navegacion" ${index === bloques.length - 1 ? 'disabled' : ''}>Siguiente ▶</button>
        </div>
      `,
        showConfirmButton: false,
        showCancelButton: true,
        cancelButtonText: 'Cerrar',
        customClass: {
          popup: 'swal2-popup-wide'
        },
        didRender: () => {
          const anteriorBtn = document.getElementById('anteriorBtn') as HTMLButtonElement;
          const siguienteBtn = document.getElementById('siguienteBtn') as HTMLButtonElement;
          const copiarBtn = document.getElementById('copiarBtn') as HTMLButtonElement;

          if (anteriorBtn) {
            anteriorBtn.onclick = () => mostrarPagina(index - 1);
          }

          if (siguienteBtn) {
            siguienteBtn.onclick = () => mostrarPagina(index + 1);
          }

          if (copiarBtn) {
            copiarBtn.onclick = () => {
              const text = document.getElementById('bloqueTexto')?.textContent || '';
              navigator.clipboard.writeText(text).then(() => {
                // ✅ Crear toast manual sin cerrar SweetAlert
                const toast = document.createElement('div');
                toast.textContent = '✔ Copiado al portapapeles';
                toast.style.position = 'fixed';
                toast.style.top = '20px';
                toast.style.right = '20px';
                toast.style.background = '#38b000';
                toast.style.color = '#fff';
                toast.style.padding = '10px 16px';
                toast.style.borderRadius = '8px';
                toast.style.boxShadow = '0 2px 6px rgba(0,0,0,0.2)';
                toast.style.fontSize = '14px';
                toast.style.zIndex = '9999';
                document.body.appendChild(toast);

                setTimeout(() => {
                  toast.remove();
                }, 2000);
              });
            };
          }

        }
      });
    };

    if (bloques.length === 0) {
      Swal.fire('Sin guías', 'No se encontraron guías para mostrar.', 'info');
    } else {
      mostrarPagina(0);
    }
  }


  macheoPaquetes(): void {
    Swal.fire({
      title: 'Macheo en proceso...',
      html: 'Por favor espera mientras se realiza el macheo de los paquetes.',
      allowOutsideClick: false,
      allowEscapeKey: false,
      didOpen: () => {
        Swal.showLoading();
      }
    });

    this.pakage.MatchingPackage(this.incomingPackageId).subscribe({
      next: (response) => {
        Swal.fire({
          icon: 'success',
          title: '¡Macheo completo!',
          html: `
          <p>El proceso se completó correctamente.</p>
          <pre style="text-align:left; background:#f4f4f4; padding:10px; border-radius:6px;">${JSON.stringify(response.data, null, 2)}</pre>
        `,
          width: 600
        });
      },
      error: (error) => {
        console.error('Error al hacer macheo:', error);
        Swal.fire({
          icon: 'error',
          title: 'Error en el macheo',
          text: 'Ocurrió un error al procesar el macheo de paquetes.'
        });
      }
    });
  }


}
