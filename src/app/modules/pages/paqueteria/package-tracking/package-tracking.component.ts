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
import { DatePipe } from '@angular/common';
import { Observable } from 'rxjs';
import { ApiResponse } from 'src/app/models/ApiResponse';


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
  isExel: boolean = false;
  isCharge: boolean = false; // Para controlar el estado del botón de macheo de costos
  isLoading: boolean = false;
  page: number = 0;
  size: number = 20;
  isMatchPrice: boolean = false;
  isPriceExel: boolean = false;
  isCost: boolean = false; // Para controlar el estado del botón de macheo de costos
  paquetesNormales: any[] = [];
  paquetesConCosto: any[] = [];
  activeTab: string = 'normales'; // o 'costos'
  searchTerm: string = '';
  isPrice: any;
  pageCost: number = 0;
  sizeCost: number = 20;
  totalCost = 0;
  paquetesAgrupados: any[] = []; // Agrupados y paginados
  isLoadingCost: boolean = false;

  constructor(
    private pakage: PakageService,
    private fileTransferService: FileTransferService,
    private route: ActivatedRoute,
    private datePipe: DatePipe

  ) {

  }
  ngOnInit(): void {
    this.incomingPackageId = this.route.snapshot.paramMap.get('id');
    this.getData(this.page, this.size);
    this.getPakagesByCost(this.pageCost, this.sizeCost);

  }

  cambiarPagina(pagina: number) {
    this.page = pagina;
    this.getData(this.page, this.size);
  }
  cambiarPaginaCost(pagina: number) {
    this.pageCost = pagina;
    this.getPakagesByCost(this.pageCost, this.sizeCost);
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

  getData(page: number, size: number): void {
    this.isLoading = true;
    this.paquetesAgrupados = [];
    this.pakage.getPackageByCarga(this.incomingPackageId, page, size, "false").subscribe(
      response => {
        this.isCharge = true;
        // console.log(response.data)
        this.total = response.data.total;
        this.isMatch = response.data.cargamento.isMatch;
        this.cargamento = response.data.cargamento;
        this.isPrice = response.data.cargamento.isPrice;

        this.paquetesNormales = response.data.packages;
        this.agruparPorFechaDeEntrega(this.paquetesNormales);

        this.isLoading = false;
        this.isExel = response.data.cargamento.isExel;
        this.isCost = response.data.cargamento.isCost;
        this.isMatchPrice = response.data.cargamento.isMatchPrice;
        this.isPriceExel = response.data.cargamento.isPriceExel;
        // console.log('isCreateExel:', this.isCreateExel);
      },
      error => {
        console.error('Error al obtener los datos:', error);
        this.isLoading = false;
      }
    );

  }

  getPakagesByCost(page: number, size: number): void {
    this.isLoadingCost = true;
    this.paquetesConCosto = [];
    this.pakage.getPackageByCarga(this.incomingPackageId, page, size, "true").subscribe(
      response => {
        this.totalCost = response.data.total;
        this.isLoadingCost = false;
        this.paquetesConCosto = response.data.packages;

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
          guia: paquete.guia,
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
          commitDate: `${(date.getMonth() + 1).toString().padStart(2, '0')}/${date.getDate().toString().padStart(2, '0')}/${date.getFullYear()}`,
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
              this.getData(this.page, this.size);
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

  histotyPackage(paquete: any): void {
    this.pakage.getHistoryByPakage(paquete.id).subscribe((resp) => {
      if (resp.success && resp.data) {
        const history = resp.data.sort((a: { tsCreated: number; }, b: { tsCreated: number; }) => a.tsCreated - b.tsCreated);
        const htmlContent = history.map((entry: { tsCreated: string | number | Date; catStatus: { name: string; config: { config: { color: string; }; }; }; description: any; }) => {
          const date = this.datePipe.transform(entry.tsCreated, 'yyyy-MM-dd HH:mm:ss');
          const status = entry.catStatus?.name || 'Sin estatus';
          const description = entry.description ? `<div><strong>Detalle:</strong> ${entry.description}</div>` : '';
          const color = entry.catStatus?.config?.config?.color || '#888';

          return `
          <div style="margin-bottom: 15px;">
            <div style="color: ${color}; font-weight: bold;">${status}</div>
            <div style="font-size: 12px; color: #555;">${date}</div>
            ${description}
          </div>
        `;
        }).join('');

        Swal.fire({
          title: 'Historial del Paquete 📦',
          html: htmlContent,
          width: 600,
          showCloseButton: true,
          confirmButtonText: 'Cerrar',
          scrollbarPadding: false
        });
      } else {
        Swal.fire('Error', 'No se pudo obtener el historial del paquete.', 'error');
      }
    });
  }

  deletePackage(paquete: any): void {
    Swal.fire({
      title: '¿Estás seguro?',
      text: `¿Deseas eliminar el paquete con guía ${paquete.guia}?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    }).then(result => {
      if (result.isConfirmed) {
        this.pakage.DeletePackage(paquete.id).subscribe(
          response => {
            Swal.fire('¡Eliminado!', `El paquete ${paquete.guia} ha sido eliminado.`, 'success');
            this.getData(this.page, this.size);
          },
          error => {
            console.error('Error al eliminar el paquete:', error);
            Swal.fire('Error', 'No se pudo eliminar el paquete.', 'error');
          }
        );
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

  // onFileSelected(event: any, tipo: string): void {
  //   const file: File = event.target.files[0];

  //   if (file) {
  //     const reader: FileReader = new FileReader();
  //     reader.onload = (e: any) => {
  //       const arrayBuffer = e.target.result;
  //       const uint8Array = new Uint8Array(arrayBuffer);

  //       // Verificamos si el archivo contiene números en formato científico
  //       const textReader = new FileReader();
  //       textReader.onload = (event: any) => {
  //         const textContent = event.target.result as string;

  //         if (/[\d.]+e[+-]?\d+/i.test(textContent)) {
  //           Swal.fire({
  //             icon: 'error',
  //             title: 'Formato inválido detectado',
  //             text: 'El archivo contiene números en formato científico como "3.9068E+11", lo cual no es permitido.',
  //           });
  //           return;
  //         }

  //         const workbook: XLSX.WorkBook = XLSX.read(uint8Array, { type: 'array' });

  //         const sheetName = workbook.SheetNames[0];
  //         const worksheet = workbook.Sheets[sheetName];

  //         const jsonDataOriginal = XLSX.utils.sheet_to_json(worksheet, {
  //           defval: '',
  //           raw: false,
  //           dateNF: 'mm/dd/yyyy' // Formato de fecha
  //         });

  //         const toCamelCase = (str: string) => {
  //           return str
  //             .trim()
  //             .toLowerCase()
  //             .replace(/[^a-zA-Z0-9 ]/g, '')
  //             .replace(/^(\w)/, (_, c) => c.toLowerCase())             // quita caracteres especiales
  //             .replace(/(?:^\w|[A-Z]|\b\w)/g, (word, index) =>
  //               index === 0 ? word.toLowerCase() : word.toUpperCase()

  //             )
  //             .replace(/\s+/g, '');

  //         };

  //         const jsonData = jsonDataOriginal.map((row: any) => {
  //           const newRow: any = {};

  //           Object.keys(row).forEach(key => {
  //             const newKey = toCamelCase(key);
  //             const value = row[key];

  //             // Detectar si es una fecha
  //             if (value instanceof Date || (!isNaN(Date.parse(value)) && typeof value === 'string')) {
  //               const date = dayjs(value);
  //               newRow[newKey] = date.isValid() ? date.format('MM/DD/YYYY') : value;
  //             } else {
  //               newRow[newKey] = value;
  //             }
  //           });

  //           return newRow;
  //         });

  //         if (tipo === 'normal') {
  //           this.enviarAlBackend(jsonData);
  //         } else if (tipo === 'costos') {
  //           this.enviarAlBackendCostos(jsonData);
  //         }
  //       };

  //       // Ahora leemos como texto para validación previa
  //       textReader.readAsText(file);
  //     };


  //     reader.readAsArrayBuffer(file); // ✅ lee como binario
  //   }
  // }

  // Método para enviar los datos al backend
enviarArchivoAlBackend(event: any, tipo: string): void {
  const file: File = event.target.files[0];
  if (!file) return;
  Swal.fire({
    title: 'Cargando consolidado...',
    html: '<b>Por favor espera</b>',
    allowOutsideClick: false,
    didOpen: () => Swal.showLoading()
  });

  let request$: Observable<ApiResponse>;

  if (tipo === 'normal') {
    request$ = this.pakage.sendExcelDelivery(file, this.incomingPackageId);
  } else if (tipo === 'costos') {
    request$ = this.pakage.sendExcelCost(file, this.incomingPackageId);
  } else {
    Swal.fire('Error', 'Tipo de carga no soportado', 'error');
    return;
  }

  request$.subscribe(
    (response) => {
      this.getData(this.page, this.size);

      const duplicadas: string[] = response.data?.guiasDuplicadas || [];
      const html = duplicadas.length
        ? `<div style="margin-top:10px; text-align:left;">
             <p><b>📦 Guías duplicadas encontradas:</b></p>
             <ul style="max-height:180px; overflow-y:auto; padding-left:18px; font-family:monospace; color:#b91c1c;">
               ${duplicadas.map(g => `<li>${g}</li>`).join('')}
             </ul>
           </div>`
        : `<p style="color:green;"><b>No se encontraron guías duplicadas 🎉</b></p>`;

      Swal.fire({
        icon: 'success',
        title: '¡Éxito!',
        html: `<p>✅ Se cargó el consolidado correctamente.</p>${html}`,
        confirmButtonText: 'Aceptar',
        width: 500
      });
    },
    (err) => {
      Swal.fire('Error', `${err.error?.message}`, 'error');
    }
  );
}

  // enviarAlBackendCostos(data: any): void { // Reemplaza con el ID real del paquete entrante
  //   Swal.fire({
  //     title: 'Cargando consolidado...',
  //     html: '<b>Por favor espera</b>',
  //     allowOutsideClick: false,
  //     didOpen: () => {
  //       Swal.showLoading(); // icono de carga
  //     }
  //   });
  //   this.pakage.SentDataExelCost(data, this.incomingPackageId).subscribe(
  //     (response) => {
  //       // console.log(response.data);
  //       this.getData(this.page, this.size); // Actualiza la lista después de enviar los datos
  //       Swal.fire({
  //         title: '¡Éxito!',
  //         text: 'Se cargo el consolidado correctamente.',
  //         icon: 'success',
  //         showConfirmButton: false,
  //         timer: 1500,
  //         timerProgressBar: true
  //       });
  //     },
  //     (err) => {
  //       Swal.fire(
  //         'Error',
  //         ` ${err.error?.message}`,
  //         'error'
  //       );
  //     }
  //   );

  // }

  mostrarSwal(): void {
    const headers = new HttpHeaders({ 'incomingPackageId': this.incomingPackageId });

    this.pakage.getConfigPackageOrg(headers).subscribe({
      next: (response) => {
        const { minvalue, maxvalue } = response.data.config;

        Swal.fire({
          title: 'Escanea el paquete',
          html: `
    <style>
      html, body, .swal2-container, .swal2-popup {
        overflow-x: hidden !important;
        max-width: 100vw !important;
      }

      .swal2-popup {
  width: 95vw !important;
  max-width: 600px !important; /* ✅ nuevo */
  box-sizing: border-box !important;
  padding: 1rem !important;
}


      #input-paquete.swal2-input {
        width: 100% !important;
        max-width: 100% !important;
        box-sizing: border-box !important;
        margin: 0 auto;
      }

      #ultimos-paquetes {
        max-height: 200px;
        overflow-y: auto;
        font-family: sans-serif;
        font-size: 14px;
        margin-top: 1rem;
        text-align: left;
        width: 100%;
        box-sizing: border-box;
      }

      @media (max-width: 400px) {
        #ultimos-paquetes div {
          font-size: 13px;
        }
      }
    </style>

    <input id="input-paquete" class="swal2-input" placeholder="Escanea o escribe el paquete" autofocus>
    <div id="ultimos-paquetes"></div>
  `,
          showCancelButton: true,
          confirmButtonText: 'Cerrar',
          allowOutsideClick: false,
          didOpen: () => {
            const input = document.getElementById('input-paquete') as HTMLInputElement;
            const lista = document.getElementById('ultimos-paquetes');
            const historial: string[] = [];
            let enviados = 0;
            let debounceTimer: any;

            const renderLista = () => {
              if (!lista) return;
              lista.innerHTML = historial.slice(-10).reverse().map((p) =>
                `<div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 6px; padding: 4px 8px; border: 1px solid #ccc; border-radius: 6px;">
    <span>${p}</span>
    <span style="color: #22c55e; font-size: 18px;">✅</span>
  </div>`
              ).join('');

            };

            const enviarPaquete = (paquete: string) => {
              this.pakage.paquetesEscaneados(paquete, this.incomingPackageId).subscribe({
                next: () => {
                  historial.push(paquete);
                  enviados++;
                  renderLista();
                  this.getData(this.page, this.size); // Actualiza la lista de paquetes
                  // 🔄 Limpiar lista cada 30 envíos
                  if (enviados % 30 === 0) {
                    historial.length = 0;
                    renderLista();
                    Swal.showValidationMessage('ℹ️ Lista de paquetes limpiada automáticamente tras 30 envíos.');
                  }
                },
                error: (err) => {
                  Swal.fire('Error', `No se pudo guardar el paquete "${paquete}": ${err.error?.message || 'Error desconocido'}`, 'error');
                }
              });
            };

            const procesarInput = (valor: string) => {
              if (valor.length < minvalue) {
                Swal.showValidationMessage(`❌ El paquete debe tener al menos ${minvalue} caracteres.`);
                setTimeout(() => Swal.resetValidationMessage(), 4000);
                return;
              }

              const recortado = valor.length > maxvalue
                ? valor.substring(valor.length - maxvalue)
                : valor;

              enviarPaquete(recortado);
            };

            input.addEventListener('input', () => {
              if (debounceTimer) clearTimeout(debounceTimer);
              debounceTimer = setTimeout(() => {
                const valor = input.value.trim();
                if (valor) {
                  procesarInput(valor);
                  input.value = '';
                }
              }, 400);
            });

            input.focus();
          }
        });
      },
      error: (err) => {
        console.error('Error al obtener configuración de longitud:', err);
        Swal.fire('Error', 'No se pudo cargar la configuración de escaneo.', 'error');
      }
    });
  }

  enviarListadoDePaquetes(): void {
    Swal.fire({
      title: 'Pegar listado de paquetes',
      html: `
    <div style="width: 100%;">
      <textarea id="inputPaquetes"
        placeholder="Pega los números de guía aquí. Uno por línea o separados por espacio"
        rows="10"
        style="
          resize: vertical;
          width: 100%;
          min-height: 200px;
          padding: 10px;
          font-family: monospace;
          font-size: 14px;
          box-sizing: border-box;
          border: 1px solid #ccc;
          border-radius: 5px;
          overflow-x: hidden;
        ">
      </textarea>
    </div>
  `,
      showCancelButton: true,
      confirmButtonText: '📤 Enviar',
      cancelButtonText: 'Cancelar',
      customClass: {
        popup: 'swal2-responsive-popup'
      },
      preConfirm: () => {
        const input = (document.getElementById('inputPaquetes') as HTMLTextAreaElement).value;
        if (!input.trim()) {
          Swal.showValidationMessage('Debes ingresar al menos un número de paquete');
          return;
        }
        return input;
      }
    }).then(result => {
      if (result.isConfirmed && result.value) {
        const texto = result.value.trim();
        const listado = texto.split(/\s+/); // Divide por espacio, salto de línea, tab, etc.

        // Mostrar loading mientras se hace la llamada
        Swal.fire({
          title: 'Enviando paquetes...',
          allowOutsideClick: false,
          didOpen: () => {
            Swal.showLoading();
          }
        });

        this.pakage.SentListPackage(listado, this.incomingPackageId).subscribe({
          next: (res) => {
            this.getData(this.page, this.size); // Actualiza la lista de paquetes
            this.getPakagesByCost(this.pageCost, this.sizeCost); // Actualiza la lista de paquetes con costo
            Swal.fire('✅ Éxito', 'Los paquetes fueron enviados correctamente.', 'success');
          },
          error: (error) => {
            const msg = error?.error?.message || 'Ocurrió un error al enviar los paquetes.';
            Swal.fire('❌ Error', msg, 'error');
          }
        });
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
    this.pakage.getGuiasByIncomingPackage(this.incomingPackageId).subscribe({
      next: (response) => {
        const guias: string[] = response.data || [];

        const bloques: string[] = [];
        for (let i = 0; i < guias.length; i += 50) {
          bloques.push(guias.slice(i, i + 50).join(', '));
        }

        let paginaActual = 0;

        const descargarExcel = () => {
          const data = guias.map(guia => ({ Guia: guia }));
          const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(data);
          const workbook: XLSX.WorkBook = XLSX.utils.book_new();
          XLSX.utils.book_append_sheet(workbook, worksheet, 'Guias');
          XLSX.writeFile(workbook, `Guias_Paquete_${this.incomingPackageId}.xlsx`);
        };

        const mostrarPagina = (index: number) => {
          const contenido = bloques[index] || '';

          Swal.fire({
            title: `Guías (bloque ${index + 1} de ${bloques.length})`,
            html: `
            <div style="max-height: 250px; overflow-y: auto; background: #f9fafb; padding: 12px; font-family: monospace; border-radius: 6px; border: 1px solid #ddd;">
              <span id="bloqueTexto">${contenido}</span>
            </div>
            <div style="margin-top: 12px; display: flex; flex-wrap: wrap; gap: 8px; justify-content: space-between; align-items: center;">

              <button id="copiarBtn" class="swal2-styled swal2-confirm btn-copiar">📋 Copiar</button>
              <button id="descargarBtn" class="swal2-styled swal2-confirm btn-descargar">📥 Descargar Excel</button>
              <button id="anteriorBtn" class="swal2-styled swal2-default btn-navegacion" ${index === 0 ? 'disabled' : ''}>◀ Anterior</button>
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
              const descargarBtn = document.getElementById('descargarBtn') as HTMLButtonElement;

              if (anteriorBtn) anteriorBtn.onclick = () => mostrarPagina(index - 1);
              if (siguienteBtn) siguienteBtn.onclick = () => mostrarPagina(index + 1);
              if (copiarBtn) {
                copiarBtn.onclick = () => {
                  const text = document.getElementById('bloqueTexto')?.textContent || '';
                  navigator.clipboard.writeText(text).then(() => {
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
                    setTimeout(() => toast.remove(), 2000);
                  });
                };
              }
              if (descargarBtn) descargarBtn.onclick = descargarExcel;
            }
          });
        };

        if (bloques.length === 0) {
          Swal.fire('Sin guías', 'No se encontraron guías para mostrar.', 'info');
        } else {
          mostrarPagina(0);
        }
      },
      error: (error) => {
        console.error('Error al obtener guías:', error);
        Swal.fire('Error', 'No se pudieron obtener las guías.', 'error');
      }
    });
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
        this.getData(this.page, this.size);
        this.getPakagesByCost(this.pageCost, this.sizeCost); // Actualiza la lista después del macheo
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

  macheoPaquetesCostos(): void {
    Swal.fire({
      title: 'Macheo en proceso...',
      html: 'Por favor espera mientras se realiza el macheo de los paquetes.',
      allowOutsideClick: false,
      allowEscapeKey: false,
      didOpen: () => {
        Swal.showLoading();
      }
    });

    this.pakage.MatchingPackageCost(this.incomingPackageId).subscribe({
      next: (response) => {
        this.getData(this.page, this.size);
        this.getPakagesByCost(this.pageCost, this.sizeCost); // Actualiza la lista después del macheo
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
