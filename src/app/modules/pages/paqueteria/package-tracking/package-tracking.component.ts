import { formatDate } from '@angular/common';
import { Component, OnInit } from '@angular/core';
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

  isLoading: boolean = false;
  page: number = 0;
  size: number = 20;


  paquetesAgrupados: any[] = []; // Agrupados y paginados

  constructor(
    private pakage: PakageService,
    private fileTransferService: FileTransferService
  ) {

  }
  ngOnInit(): void {
    this.fileTransferService.currentIdTercero$
      // <- solo se ejecuta una vez
      .subscribe(id => {
        if (id !== null) {

          this.incomingPackageId = id;
           this.fileTransferService.clearIdTercero();
        }
      });

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
          <p><strong>Empleado:</strong> ${c?.employee.name} ${c?.employee.firstSurname}</p>
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
          dateNF: 'm/dd/yyyy' // Formato de fecha
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
            newRow[newKey] = row[key];
          });
          return newRow;
        });

        console.log('JSON limpio con títulos en camelCase:', jsonData);
        this.enviarAlBackend(jsonData);
      };


      reader.readAsArrayBuffer(file); // ✅ lee como binario
    }
  }

  // Método para enviar los datos al backend
  enviarAlBackend(data: any): void {
    console.log(data) // Reemplaza con el ID real del paquete entrante
    this.pakage.SentDataExel(data, this.incomingPackageId).subscribe(
      response => {
        console.log(response.data);
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

  mostrarSwal() {
    this.paquetesEsc = [];

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
        return this.paquetesEsc;
      },
      didOpen: () => {
        const input = document.getElementById('input-paquete') as HTMLInputElement;
        const lista = document.getElementById('lista-paquetes');

        const renderLista = () => {
          if (!lista) return;
          lista.innerHTML = this.paquetesEsc.map((p, i) => `
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 6px; padding: 4px 8px; border: 1px solid #ccc; border-radius: 6px;">
            <span>${p}</span>
            <button style="border: none; background: transparent; font-size: 16px; cursor: pointer; color: #b91c1c;"
              onclick="document.dispatchEvent(new CustomEvent('quitar-paquete', { detail: ${i} }))">✖</button>
          </div>
        `).join('');
        };

        input?.addEventListener('keypress', (event: KeyboardEvent) => {
          if (event.key === 'Enter' && input.value.trim()) {
            this.paquetesEsc.push(input.value.trim());
            input.value = '';
            renderLista();
          }
        });

        document.addEventListener('quitar-paquete', (e: any) => {
          const index = e.detail;
          this.paquetesEsc.splice(index, 1);
          renderLista();
        });

        input?.focus();
      }
    }).then((result) => {
      if (result.isConfirmed) {
        const nuevosPaquetes = [...this.paquetesEsc];

        // 👇 Llamada al servicio para enviar al backend
        this.pakage.paquetesEscaneados(nuevosPaquetes, this.incomingPackageId)
          .subscribe({
            next: (response) => {
              Swal.fire('¡Guardado!', `Se enviaron ${nuevosPaquetes.length} paquetes.`, 'success');
              this.getData(this.page, this.size);
            },
            error: (error) => {
              console.error('Error al enviar paquetes:', error);
              Swal.fire('Error', 'Ocurrió un problema al enviar los paquetes.', 'error');
            }
          });
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
