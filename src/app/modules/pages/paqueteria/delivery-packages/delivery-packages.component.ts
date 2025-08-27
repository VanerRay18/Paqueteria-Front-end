import { Component, OnInit } from '@angular/core';
import { FileTransferService } from 'src/app/services/file-transfer.service';
import { PakageService } from 'src/app/services/pakage.service';
import * as Papa from 'papaparse';
import Swal from 'sweetalert2';
import * as XLSX from 'xlsx';
import { formatDate } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { OrgItem } from 'src/app/shared/interfaces/utils';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-delivery-packages',
  templateUrl: './delivery-packages.component.html',
  styleUrls: ['./delivery-packages.component.css']
})
export class DeliveryPackagesComponent implements OnInit {
  paqueteEncontrado: any = null;
  deliveryInfo: any = null;
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
  cost: any = 0;
  isLoading: boolean = false;
  page: number = 0;
  size: number = 20;
  searchTerm: string = '';
  typeP = [
    { id: 1, name: 'Normal' },
    { id: 2, name: 'Costo' },
  ];
  paquetesCost: any;
  paquetesNormal: any;
  Typepakage: number | null = null;

  paquetesAgrupados: any[] = []; // Agrupados y paginados
  constructor(
    private pakage: PakageService,
    private fileTransferService: FileTransferService,
    private route: ActivatedRoute,
     private datePipe: DatePipe
  ) { }

  ngOnInit(): void {
    this.deliveryId = this.route.snapshot.paramMap.get('id');
    this.getData(this.page, this.size);

  }
  cambiarPagina(pagina: number) {
    this.page = pagina;
    this.getData(this.page, this.size);
  }

  selectTypepakage(typeId: number | null) {
    if (typeId === 2) {
      this.isLoading = true;
      this.paquetesAgrupados = [];
      this.getPakagesCost(this.page, this.size);
    } else {
      this.isLoading = true;
      this.paquetesAgrupados = [];
      this.getPakagesNorm(this.page, this.size);
    }
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
    }).then((result) => {
      if (result.isConfirmed) {
        this.pakage.DeletePackageByDelivery(paquete.id, this.deliveryId, 'Eliminación de paquete').subscribe(
          response => {
            Swal.fire('¡Eliminado!', `El paquete con guía ${paquete.guia} ha sido eliminado.`, 'success');
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

  getData(page: number, size: number): void {
    this.isLoading = true;
    this.paquetesAgrupados = [];
    this.pakage.getPackageByDelivery(this.deliveryId, page, size, '').subscribe(
      response => {
        this.total = response.data.total
        this.cargamento = response.data.cargamento
        this.cost = response.data.cost;
        this.paquetes = response.data.paquetes; // Asignar los datos recibidos a la variable paquetes
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

  getPakagesNorm(page: number, size: number): void {
    this.isLoading = true;
    this.paquetes = [];
    this.pakage.getPackageByDelivery(this.deliveryId, page, size, 'false').subscribe(
      response => {
        this.paquetesNormal = response.data.paquetes; // Asignar los datos recibidos a la variable paquetes
        // console.log(response.data.packages);
        this.agruparPorFechaDeEntrega(this.paquetesNormal);
        this.isLoading = false;
      },
      error => {
        console.error('Error al obtener los datos:', error);
        this.isLoading = false;
      }
    );
  }

  getPakagesCost(page: number, size: number): void {
    this.isLoading = true;
    this.paquetesCost = [];
    this.pakage.getPackageByDelivery(this.deliveryId, page, size, 'true').subscribe(
      response => {
        this.paquetesCost = response.data.paquetes; // Asignar los datos recibidos a la variable paquetes
        // console.log(response.data.packages);
        this.agruparPorFechaDeEntrega(this.paquetesCost);
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

        const sheetName = workbook.SheetNames[0]; // leer solo la primera hoja
        const worksheet = workbook.Sheets[sheetName];

        const jsonData = XLSX.utils.sheet_to_json(worksheet, { defval: '' });

        console.log('JSON generado desde Excel:', jsonData);

        this.enviarAlBackend(jsonData);
      };

      reader.readAsArrayBuffer(file); // ✅ lee como binario
    }
  }

  // Método para enviar los datos al backend
  enviarAlBackend(data: any): void {
    console.log(data) // Reemplaza con el ID real del paquete entrante
    this.pakage.SentDataExel(data, this.deliveryId

    ).subscribe(
      response => {
        console.log(response.data);
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

    this.pakage.getCatPakageOrg().subscribe({
      next: (response) => {
        const organizaciones: OrgItem[] = response.data || [];

        Swal.fire({
          title: 'Selecciona la organización y comienza a escanear',
          html: `
          <select id="select-org" class="swal2-input" style="margin-bottom: 10px;">
            <option value="">-- Selecciona organización --</option>
            ${organizaciones.map((org: OrgItem) =>
            `<option value="${org.id}" data-min="${org.config.config.minvalue}" data-max="${org.config.config.maxvalue}">
                ${org.name}
              </option>`
          ).join('')}
          </select>
          <input id="input-paquete" class="swal2-input" placeholder="Escanea o escribe el paquete" autofocus>
          <div id="alerta-error" style="color: red; font-size: 13px; margin-top: 4px;"></div>
          <div id="lista-paquetes" style="
            max-height: 250px;
            overflow-y: auto;
            text-align: left;
            font-weight: 500;
            font-family: sans-serif;
            margin-top: 1rem;"></div>
        `,
          showCancelButton: true,
          confirmButtonText: 'Finalizar',
          cancelButtonText: 'Cancelar',
          allowOutsideClick: false,
          // 👉 Ya no necesitas preConfirm
          didOpen: () => {
            const select = document.getElementById('select-org') as HTMLSelectElement;
            const input = document.getElementById('input-paquete') as HTMLInputElement;
            const lista = document.getElementById('lista-paquetes');
            const alerta = document.getElementById('alerta-error');
            let minvalue = 0;
            let maxvalue = 999;
            let debounceTimer: any;

            select?.addEventListener('change', () => {
              const option = select.selectedOptions[0];
              minvalue = parseInt(option.getAttribute('data-min') || '0', 10);
              maxvalue = parseInt(option.getAttribute('data-max') || '999', 10);
              alerta!.textContent = '';
            });

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

            const agregarPaquete = (valor: string) => {
              if (!select.value) {
                alerta!.textContent = '⚠️ Selecciona primero una organización.';
                return;
              }
              if (valor.length < minvalue) {
                alerta!.textContent = `❌ El paquete debe tener al menos ${minvalue} caracteres.`;
                return;
              }
              const recortado = valor.length > maxvalue ? valor.substring(valor.length - maxvalue) : valor;
              if (this.paquetesEsc.includes(recortado)) {
                alerta!.textContent = `⚠️ El paquete "${recortado}" ya fue escaneado.`;
                return;
              }

              alerta!.textContent = ''; // limpiar error
              this.paquetesEsc.push(recortado);

              // ✅ Enviar de inmediato al backend como string (uno por uno)
              this.pakage.addPackagesInDelivery(recortado, this.deliveryId).subscribe({
                next: () => {
                  renderLista();
                  input.value = ''; // limpiar input
                },
                error: (err) => {
                  alerta!.textContent = `❌ No se pudo guardar el paquete: ${err.error?.message || 'Error desconocido'}`;
                  // Opcional: quitarlo del array si no se guardó
                  this.paquetesEsc.pop();
                  renderLista();
                }
              });
            };

            input?.addEventListener('input', () => {
              if (debounceTimer) clearTimeout(debounceTimer);
              debounceTimer = setTimeout(() => {
                const valor = input.value.trim();
                if (valor) {
                  agregarPaquete(valor);
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
          if (result.isConfirmed) {
            // Aquí ya se enviaron todos de uno por uno; refrescar datos si quieres:
            this.getData(this.page, this.size);
            Swal.fire('¡Completado!', 'Se terminó el registro de paquetes.', 'success');
          }
        });
      },
      error: (err) => {
        console.error('Error al obtener organizaciones:', err);
        Swal.fire('Error', 'No se pudieron cargar las organizaciones.', 'error');
      }
    });
  }


enviarListadoDePaquetes(): void {
  this.pakage.getCatPakageOrg().subscribe({
    next: (response) => {
      const organizaciones: OrgItem[] = response.data || [];

      Swal.fire({
        title: 'Pegar listado de paquetes',
        html: `
          <div style="width: 100%; margin-bottom:10px;">
            <select id="select-org" class="swal2-input" style="margin-bottom: 10px;">
              <option value="">-- Selecciona organización --</option>
              ${organizaciones.map((org: OrgItem) =>
                `<option value="${org.id}">${org.name}</option>`
              ).join('')}
            </select>
          </div>
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
        preConfirm: () => {
          const select = document.getElementById('select-org') as HTMLSelectElement;
          const input = (document.getElementById('inputPaquetes') as HTMLTextAreaElement).value;

          if (!select.value) {
            Swal.showValidationMessage('⚠️ Debes seleccionar una organización');
            return;
          }
          if (!input.trim()) {
            Swal.showValidationMessage('⚠️ Debes ingresar al menos un número de paquete');
            return;
          }

          return { orgId: select.value, listado: input };
        }
      }).then(result => {
        if (result.isConfirmed && result.value) {
          const { orgId, listado } = result.value;
          const listadoArr = listado.trim().split(/\s+/); // dividir por espacios, saltos de línea, etc.

          // Loading mientras se envía
          Swal.fire({
            title: 'Enviando paquetes...',
            allowOutsideClick: false,
            didOpen: () => Swal.showLoading()
          });

          this.pakage.SentListPackageDelivery(listadoArr, this.deliveryId, orgId).subscribe({
            next: (res) => {
              this.getData(this.page, this.size);
              Swal.fire('✅ Éxito', 'Los paquetes fueron enviados correctamente.', 'success');
            },
            error: (error) => {
              const msg = error?.error?.message || 'Ocurrió un error al enviar los paquetes.';
              Swal.fire('❌ Error', msg, 'error');
            }
          });
        }
      });
    },
    error: (err) => {
      console.error('Error al obtener organizaciones:', err);
      Swal.fire('Error', 'No se pudieron cargar las organizaciones.', 'error');
    }
  });
}


  macheoPaquetes(): void {

  }


}
