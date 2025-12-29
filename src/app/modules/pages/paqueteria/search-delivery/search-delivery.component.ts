import { Component, OnInit } from '@angular/core';
import { FileTransferService } from 'src/app/services/file-transfer.service';
import { PakageService } from 'src/app/services/pakage.service';
import * as Papa from 'papaparse';
import Swal from 'sweetalert2';
import * as XLSX from 'xlsx';
import * as FileSaver from 'file-saver';
import { formatDate } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import dayjs from 'dayjs';
import { HttpHeaders } from '@angular/common/http';
import { ApiResponse } from 'src/app/models/ApiResponse';
import { DatePipe } from '@angular/common';
@Component({
    selector: 'app-search-delivery',
    templateUrl: './search-delivery.component.html',
    styleUrls: ['./search-delivery.component.css'],
    standalone: false
})
export class SearchDeliveryComponent implements OnInit {
  searchTerm: string = '';
  paqueteEncontrado: any = null;
  deliveryInfo: any = null;
  rango: { startDate: dayjs.Dayjs; endDate: dayjs.Dayjs } | null = null;
  catDex: any;
  car: any;
  conductor: any;
  packageInformation: any = null;
  status: any;
  deliveryId: any;
  paquetesEsc: string[] = [];
  paqueteActual: string = '';
  paquetes: any[] = [];
  cargamento: any = null;
  total: number = 0;
  catOrgs: any[] = [];
  isLoading: boolean = true;
  page: number = 0;
  size: number = 15;
  typeP = [
    { id: 1, name: 'Normal' },
    { id: 2, name: 'Costo' },
  ];
  Typepakage: number | null = null;
  packageOrg: any = null;
  packageDex: any = null; // Dex seleccionado
  packageCat: any = null; // Estado seleccionado
  statuses = [
      { id: 3, name: 'Vinculado con consolidado' },
      { id: 4, name: 'En bodega' },
      { id: 6, name: 'Cargado en unidad' },
      { id: 7, name: 'En ruta' },
      { id: 8, name: 'Entregado' },
      { id: 13, name: 'No encontrado en el consolidado' },
      { id: 14, name: 'Devuelto a la paquetería' },
      { id: 15, name: 'Vinculado con precio' },
      { id: 2, name: 'Paquete registrado' }
    ];


  paquetesAgrupados: any[] = []; // Agrupados y paginados
  constructor(
    private pakage: PakageService,
    private fileTransferService: FileTransferService,
    private route: ActivatedRoute,
    private datePipe: DatePipe
  ) { }

  ngOnInit(): void {
    // this.fileTransferService.currentIdTercero$
    //   .subscribe(id => {
    //     if (id !== null) {
    //       console.log('ID recibido:', id);
    //       this.deliveryId = id;
    //       //  this.fileTransferService.clearIdTercero();
    //     }
    //   });
    this.pakage.getCatPakageOrg().subscribe(
      response => {
        this.catOrgs = response.data;
        this.packageOrg = null;
      },
      error => {
        console.error('Error al obtener los datos:', error);
      }
    );

    this.deliveryId = this.route.snapshot.paramMap.get('id');
    this.rango = {
      startDate: dayjs().startOf('day'),
      endDate: dayjs().endOf('day')
    };

    this.pakage.getPDex().subscribe(
      (response: ApiResponse) => {
        if (response && response.data) {
          this.catDex = response.data;
        } else {
          console.warn('No se encontraron categorías Dex');
        }
      }
    );

    this.getData(this.page, this.size);

  }

  selectPackageOrg(object: any) {
    this.getData(this.page, this.size);

  }

  selectTypepakage(typeId: number | null) {
    this.getData(this.page, this.size);
  }

  selectPackageDex(object: any) {
    this.getData(this.page, this.size);
  }

  selectStatus(statusId: number | null) {
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

    this.paquetesAgrupados = [];
    if (!this.rango || !this.rango.startDate || !this.rango.endDate) { return; }

    const desdeFormatted = this.rango.startDate.format('YYYY-MM-DD');
    const hastaFormatted = this.rango.endDate.format('YYYY-MM-DD');
    //'PackageOrgId': PackageOrgId,
    let headers = new HttpHeaders;
    if (this.packageOrg == null) {
      headers = new HttpHeaders({ 'desde': desdeFormatted, 'hasta': hastaFormatted, 'page': page, 'size': size });

    } else {
      headers = new HttpHeaders({ 'PackageOrgId': this.packageOrg, 'desde': desdeFormatted, 'hasta': hastaFormatted, 'page': page, 'size': size });
    }
    if (this.packageDex != null) {
      headers = new HttpHeaders({ 'dexId': this.packageDex, 'desde': desdeFormatted, 'hasta': hastaFormatted, 'page': page, 'size': size });
    }
    if (this.Typepakage === 1) {
      headers = new HttpHeaders({ 'isCost': "false", 'desde': desdeFormatted, 'hasta': hastaFormatted, 'page': page, 'size': size });
    } else if (this.Typepakage === 2) {
      headers = new HttpHeaders({ 'isCost': "true", 'desde': desdeFormatted, 'hasta': hastaFormatted, 'page': page, 'size': size });
    }
    if (this.packageCat != null) {
      headers = new HttpHeaders({ 'packCatStatusId': this.packageCat, 'desde': desdeFormatted, 'hasta': hastaFormatted, 'page': page, 'size': size });
    }

    this.isLoading = true;
    this.pakage.getAllPackages(headers).subscribe(
      response => {
        console.log(response.data);
        this.total = Number(response.message);
        this.paquetes = response.data;
        this.agruparPorFechaDeEntrega(this.paquetes);
        this.isLoading = false;
      },
      error => {
        console.error('Error al obtener los datos:', error);
        this.isLoading = false;
      }
    );
    console.log(this.isLoading)
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

  ChangeStatus(paquete: any): void {

    const currentStatusId = paquete.status?.id;

    const statusOptionsHtml = this.statuses.map(s =>
      `<option value="${s.id}" ${s.id === currentStatusId ? 'selected' : ''}>${s.name}</option>`
    ).join('');

    Swal.fire({
      title: 'Cambiar estatus del paquete',
      html: `
      <label for="status">Selecciona nuevo estatus:</label>
      <select id="status" class="swal2-select">${statusOptionsHtml}</select>
      <br><br>
      <label for="description">Descripción (opcional):</label>
      <textarea id="description" class="swal2-textarea" placeholder="Motivo o comentario..."></textarea>
    `,
      showCancelButton: true,
      confirmButtonText: 'Actualizar',
      cancelButtonText: 'Cancelar',
      preConfirm: () => {
        const selectedStatusId = (document.getElementById('status') as HTMLSelectElement).value;
        const description = (document.getElementById('description') as HTMLTextAreaElement).value;
        if (!selectedStatusId) {
          Swal.showValidationMessage('Debes seleccionar un estatus');
          return;
        }
        return { catStatusId: selectedStatusId, description };
      }
    }).then(result => {
      if (result.isConfirmed && result.value) {
        const { catStatusId, description } = result.value;

        // Mostrar loading mientras se hace la petición
        Swal.fire({
          title: 'Actualizando estatus...',
          allowOutsideClick: false,
          didOpen: () => Swal.showLoading()
        });

        this.pakage.updatePackageStatus(paquete.id, catStatusId, description).subscribe(resp => {
          Swal.close();
          if (resp.success) {
            this.getData(this.page, this.size);
            Swal.fire('¡Éxito!', 'El estatus del paquete fue actualizado.', 'success');
          } else {
            Swal.fire('Error', 'No se pudo actualizar el estatus del paquete.', 'error');
          }
        }, () => {
          Swal.close();
          Swal.fire('Error', 'Ocurrió un error al comunicarse con el servidor.', 'error');
        });
      }
    });

  }


  downloadPackagesExcel(page: number, size: number): void {
    if (!this.rango || !this.rango.startDate || !this.rango.endDate) { return; }

    const desdeFormatted = this.rango.startDate.format('YYYY-MM-DD');
    const hastaFormatted = this.rango.endDate.format('YYYY-MM-DD');
    const headers = new HttpHeaders({ 'desde': desdeFormatted, 'hasta': hastaFormatted, 'page': page, 'size': this.total });

    // 🌀 Mostrar swal de carga
    Swal.fire({
      title: 'Generando Excel...',
      text: 'Por favor espera',
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
      }
    });


    this.pakage.getAllPackages(headers).subscribe({
      next: (resp) => {
        Swal.close(); // Cerramos cualquier Swal de carga

        // Validamos si no hay datos
        if (!resp.success || !resp.data || resp.data.length === 0) {
          Swal.fire('Sin datos', 'No hay paquetes para exportar en ese rango de fechas.', 'warning');
          return;
        }

        // Procesamos los datos y exportamos a Excel
const excelData = resp.data.map((pkg: any) => {
  const c = (pkg.consolidado && typeof pkg.consolidado === 'object') ? pkg.consolidado : null;
  const d = (pkg.delivery && typeof pkg.delivery === 'object') ? pkg.delivery : null;

  const car = d?.car ?? null;
  const emp = d?.employee ?? null;

  const nombreEmpleado = emp
    ? `${emp.name ?? ''} ${emp.firstSurname ?? ''} ${emp.secondSurname ?? ''}`.replace(/\s+/g, ' ').trim()
    : '';

  return {
    // --- Consolidado (todo) ---
    'ID Consolidado': c?.id ?? '',
    'Tracking': c?.trackingNo ?? '',
    'Nombre destinatario': c?.recipName ?? '',
    'Dirección destinatario': c?.recipAddr ?? '',
    'Ciudad destinatario': c?.recipCity ?? '',
    'Código postal destinatario': c?.recipPostal ?? '',
    'Servicio': c?.service ?? '',
    'Fecha compromiso': Array.isArray(c?.commitDate)
      ? `${c.commitDate[0]}-${String(c.commitDate[1]).padStart(2, '0')}-${String(c.commitDate[2]).padStart(2, '0')}`
      : '',
    'Teléfono destinatario': c?.recipPhone ?? '',
    'No. Consolidado': c?.consolidadoNo ?? '',

    // --- Del paquete (nivel raíz) ---
    'Guía': pkg.guia ?? '',
    'Organización': pkg.nameOrg ?? '',
    'Estatus': pkg.status?.name ?? '',
    'Total entregas': pkg.totalEntregas ?? 0,
    'Total rutas': pkg.totalRutas ?? 0,

    'Es costo': pkg.isCost ? 'Sí' : 'No',
    'Costo': pkg.isCost ? (pkg.costLoad ?? '') : '--',
    'DEX': pkg.dex ?? '',

    // --- Delivery (solo si existe; si no existe quedan vacíos) ---
    'Placa': car?.placa ?? '',
    'Marca': car?.marca ?? '',
    'Modelo': car?.modelo ?? '',
    'Color vehículo': car?.color ?? '',
    'VIN': car?.vin ?? '',

    'Conductor': nombreEmpleado,
  };
});

        const worksheet = XLSX.utils.json_to_sheet(excelData);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, 'Paquetes');

        const excelBuffer: any = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
        const blob = new Blob([excelBuffer], { type: 'application/octet-stream' });
        FileSaver.saveAs(blob, `paquetes_${desdeFormatted}_a_${hastaFormatted}.xlsx`);

        Swal.fire('¡Listo!', 'El archivo se descargó correctamente.', 'success');
      },

      error: (err) => {
        Swal.close();
        console.error('Error al obtener los datos del backend', err);
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text:  ` ${err.error?.message || 'No hay paquetes para generar el excel'}` ,
        });
      }
    });

  }


}
