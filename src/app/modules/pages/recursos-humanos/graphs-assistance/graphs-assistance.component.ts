import { Component, OnInit } from '@angular/core';
import { ApiResponse } from 'src/app/models/ApiResponse';
import { RHService } from 'src/app/services/rh.service';
import { Justificacion, Persona } from 'src/app/shared/interfaces/utils';
import Swal from 'sweetalert2';
import * as pdfMake from 'pdfmake/build/pdfmake';
import * as pdfFonts from 'pdfmake/build/vfs_fonts';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';


@Component({
  selector: 'app-graphs-assistance',
  templateUrl: './graphs-assistance.component.html',
  styleUrls: ['./graphs-assistance.component.css']
})
export class GraphsAssistanceComponent implements OnInit {
  searchTerm: string = '';
  itemsPerPage: number = 6;
  currentPage: number = 1;
  pagedData: any[] = [];
  isLoading: boolean = true;
  data: Persona[] = [];


  constructor(
    private rh: RHService
  ) {
    (pdfMake as any).vfs = (pdfFonts as any).pdfMake.vfs;
  }

  ngOnInit(): void {
    this.getDatos();
    // this.detectScreenSize();
    // window.addEventListener('resize', this.detectScreenSize.bind(this));
  }

  getDatos() {
    this.rh.getAttencendance().subscribe((response: ApiResponse) => {
      this.data = response.data;
      this.currentPage = 0;
      this.isLoading = false;
      this.paginar();
    }, error => {
      console.error('Ocurrió un error:', error);
    });
  }

  // detectScreenSize() {
  //   const isMobile = window.innerWidth <= 768;
  //   this.itemsPerPage = isMobile ? 3 : 10;
  //   this.paginar();
  // }

  paginar() {
    const startIndex = this.currentPage * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    this.pagedData = this.data.slice(startIndex, endIndex);
  }


  cambiarPagina(pagina: number) {
    this.currentPage = pagina;
    this.isLoading = true;
    this.pagedData = [];
    setTimeout(() => {
      this.paginar();
      this.isLoading = false;
    }, 500);
  }

  // Si se actualiza la data (ej: después de un filtro o fetch)
  actualizarPaginado() {
    this.currentPage = 1;
    this.paginar();
  }

  formatearHora = (timestamp: string | number | Date) => {
    if (!timestamp) return '';
    const fecha = new Date(timestamp);
    return fecha.toLocaleTimeString('es-ES', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  };



  // Total de páginas
  get totalPages(): number[] {
    const total = Math.ceil(this.data.length / this.itemsPerPage);
    return Array(total).fill(0).map((_, i) => i + 1);
  }

  abrirSwalPendientes(persona: Persona) {
    const fechaHoy = new Date().toISOString().split('T')[0];
    let dataTabla: any[] = [];
    let fechaDesde = fechaHoy;
    let fechaHasta = fechaHoy;


    const htmlContent = (data: any[] = [], desdeValue = fechaHoy, hastaValue = fechaHoy) => `\
          <style>

        @media screen and (max-width: 600px) {
          .responsive-table thead {
            display: none;
          }
          .responsive-table, .responsive-table tbody, .responsive-table tr, .responsive-table td {
            display: block;
            width: 100%;
          }
          .responsive-table tr {
            margin-bottom: 15px;
            border: 1px solid #ccc;
            border-radius: 5px;
            padding: 10px;
          }
          .responsive-table td {
            text-align: right;
            position: relative;
            padding-left: 50%;
          }
          .responsive-table td::before {
            content: attr(data-label);
            position: absolute;
            left: 15px;
            width: 45%;
            padding-right: 10px;
            white-space: nowrap;
            text-align: left;
            font-weight: bold;
          }
        }
      </style>
  <div style="display: flex; flex-wrap: wrap; gap: 10px; margin-bottom: 15px; justify-content: space-between;">
  <div style="flex: 1; min-width: 130px;">
    <label style="font-weight: 600;">Desde:</label>
    <input type="date" id="desdeInput" value="${desdeValue}" style="width: 100%; padding: 6px 10px; border-radius: 5px; border: 1px solid #ccc;">
  </div>
  <div style="flex: 1; min-width: 130px;">
    <label style="font-weight: 600;">Hasta:</label>
    <input type="date" id="hastaInput" value="${hastaValue}" style="width: 100%; padding: 6px 10px; border-radius: 5px; border: 1px solid #ccc;">
  </div>
  <div style="display: flex; align-items: end;">
    <button id="btnReporte" style="background-color: #3E5F8A; color: white; padding: 8px 18px; border: none; border-radius: 8px; font-weight: 600; cursor: pointer;">
      📄 Generar reporte
    </button>
  </div>
</div>

<div style="overflow-x: auto; max-height: 300px; overflow-y: auto; border: 1px solid #ccc; border-radius: 8px;">
  <table class="responsive-table" style="width: 100%; border-collapse: collapse; font-size: 14px;">
    <thead>
      <tr style="background-color: #f9f9f9;">
        <th style="padding: 8px; border-bottom: 1px solid #ddd;">#</th>
        <th style="padding: 8px; border-bottom: 1px solid #ddd;">Fecha</th>
        <th style="padding: 8px; border-bottom: 1px solid #ddd;">Hora</th>
        <th style="padding: 8px; border-bottom: 1px solid #ddd;">Motivo</th>
        <th style="padding: 8px; border-bottom: 1px solid #ddd;">Justificada</th>
        <th style="padding: 8px; border-bottom: 1px solid #ddd;">Comentario</th>
        <th style="padding: 8px; border-bottom: 1px solid #ddd;">E/S</th>
        <th style="padding: 8px; border-bottom: 1px solid #ddd;">Acciones</th>
      </tr>
    </thead>
    <tbody>
      ${data.length > 0 ? data.map((item, i) => `
        <tr>
          <td style="padding: 8px;">${i + 1}</td>
          <td style="padding: 8px;">${item.fecha ? new Date(item.fecha).toISOString().split('T')[0] : ''}</td>
          <td style="padding: 8px;">${item.capturated ? this.formatearHora(item.capturated) : ''}</td>
          <td style="padding: 8px;">${item.motivo || ''}</td>
          <td style="padding: 8px;">${item.justificada ? 'Sí' : 'No'}</td>
          <td style="padding: 8px;">${item.comentarios || ''}</td>
          <td style="padding: 8px;">${item.ES || ''}</td>
          <td style="padding: 8px;">
            <button class="btn-justificar" data-id="${item.id}" data-catid="${item.catId}"
              style="background-color: #f0f0f0; border: 1px solid #ccc; border-radius: 6px; padding: 4px 10px; cursor: pointer; font-size: 13px;">
              ✏️ Justificar
            </button>
          </td>
        </tr>
      `).join('') : `<tr><td colspan="8" style="text-align:center; padding: 10px;">Sin datos</td></tr>`}
    </tbody>
  </table>
</div>

  `;

    const cargarDatos = (desde: string, hasta: string) => {
      const desdeFormatted = new Date(desde).toISOString().split('T')[0];
      const hastaFormatted = new Date(hasta).toISOString().split('T')[0];

      this.rh.getAttencendanceById(persona.employeeid, 4, desdeFormatted, hastaFormatted, 0, 50)
        .subscribe((response: ApiResponse) => {
          dataTabla = response.data || []; // ✅ AQUÍ
          fechaDesde = desdeFormatted;     // ✅ y AQUÍ
          fechaHasta = hastaFormatted;
          Swal.update({
            html: htmlContent(response.data, desdeFormatted, hastaFormatted)
          });

          setTimeout(() => {
            const desdeInput = document.getElementById('desdeInput') as HTMLInputElement;
            const hastaInput = document.getElementById('hastaInput') as HTMLInputElement;

            const buscar = () => {
              const desde = desdeInput.value;
              const hasta = hastaInput.value;
              if (desde && hasta) cargarDatos(desde, hasta);
            };

            desdeInput?.addEventListener('change', buscar);
            hastaInput?.addEventListener('change', buscar);

            const btn = document.getElementById('btnReporte');
            btn?.addEventListener('click', () => {
              if (!dataTabla || dataTabla.length === 0) {
                Swal.fire('Sin datos', 'No hay información para generar el PDF.', 'warning');
                return;
              }
              this.generarReportePDF(dataTabla, fechaDesde, fechaHasta, persona.name, 'Reporte de justificantes pendinetes');
              this.generarReporteExcel(dataTabla, fechaDesde, fechaHasta, persona.name, 'Reporte de justificantes pendinetes');
              Swal.fire('Reporte generado', 'Tu archivo ha sido descargado.', 'success');
            });
            document.querySelectorAll('.btn-justificar').forEach(btn => {
              btn.addEventListener('click', () => {

                const attendanceId = (btn as HTMLElement).getAttribute('data-id');
                const catId = (btn as HTMLElement).getAttribute('data-catid');

                if (!catId) return;

                this.rh.getNextAttendance(catId).subscribe((res: ApiResponse) => {
                  const justificaciones: Justificacion[] = res.data || [];

                  Swal.fire({
                    title: 'Justificar Asistencia',
                    html: `
          <label style="display:block; text-align:left; margin-bottom:5px;"><b>Justificación:</b></label>
          <select id="selectJustificacion" class="swal2-input" style="width: 100%;">
            ${justificaciones.map(j => `<option value="${j.id}">${j.name}</option>`).join('')}
          </select>
          <br>
          <label style="display:block; text-align:left; margin-top:10px;"><b>Comentario:</b></label>
          <input type="text" id="descripcion" class="swal2-input" placeholder="Ej. Justificante médico">
        `,
                    showCancelButton: true,
                    confirmButtonText: 'Guardar',
                    preConfirm: () => {
                      const justificanteCatId = (document.getElementById('selectJustificacion') as HTMLSelectElement).value;
                      const descripcion = (document.getElementById('descripcion') as HTMLInputElement).value.trim();

                      if (!descripcion) {
                        Swal.showValidationMessage('La descripción es obligatoria');
                        return;
                      }

                      // Buscar la justificación seleccionada en el arreglo
                      const justificacionSeleccionada = justificaciones.find(j => j.id === Number(justificanteCatId));

                      // Extraer la propiedad 'to_day' para enviarla como 'justificante'
                      const justificante = justificacionSeleccionada ? justificacionSeleccionada.to_day : false;

                      return {
                        justificante: justificante,  // aquí agregamos justificante
                        catId: Number(justificanteCatId),
                        descripcion
                      };
                    }
                  }).then(result => {
                    if (result.isConfirmed && attendanceId) {
                      this.rh.UpdateAttendance(result.value, attendanceId).subscribe(() => {
                        Swal.fire('¡Éxito!', 'La asistencia/Falta fue actualizada.', 'success');
                        this.getDatos();
                        const desde = (document.getElementById('desdeInput') as HTMLInputElement).value;
                        const hasta = (document.getElementById('hastaInput') as HTMLInputElement).value;
                        if (desde && hasta) cargarDatos(desde, hasta);
                      }, () => {
                        Swal.fire('Error', 'No se pudo guardar el justificante.', 'error');
                      });
                    }
                  });
                });
              });
            });


          }, 0);
        });
    };

    Swal.fire({
      title: `<strong>Pendientes de ${persona.name}</strong>`,
      html: htmlContent([]),
      width: 900,
      showConfirmButton: false,
      showCloseButton: true,
      customClass: { popup: 'swal-wide' },
      didOpen: () => {
        const desdeInput = document.getElementById('desdeInput') as HTMLInputElement;
        const hastaInput = document.getElementById('hastaInput') as HTMLInputElement;

        const buscar = () => {
          const desde = desdeInput.value;
          const hasta = hastaInput.value;
          if (desde && hasta) cargarDatos(desde, hasta);
        };

        desdeInput?.addEventListener('change', buscar);
        hastaInput?.addEventListener('change', buscar);


        buscar(); // carga inicial
      }
    });
  }



  abrirSwalJustificados(persona: Persona) {
    const fechaHoy = new Date().toISOString().split('T')[0];
    let dataTabla: any[] = [];
    let fechaDesde = fechaHoy;
    let fechaHasta = fechaHoy;


    // Función para generar el HTML con los datos
    const htmlContent = (data: any[] = [], desdeValue = fechaHoy, hastaValue = fechaHoy) => `
       <style>

        @media screen and (max-width: 600px) {
          .responsive-table thead {
            display: none;
          }
          .responsive-table, .responsive-table tbody, .responsive-table tr, .responsive-table td {
            display: block;
            width: 100%;
          }
          .responsive-table tr {
            margin-bottom: 15px;
            border: 1px solid #ccc;
            border-radius: 5px;
            padding: 10px;
          }
          .responsive-table td {
            text-align: right;
            position: relative;
            padding-left: 50%;
          }
          .responsive-table td::before {
            content: attr(data-label);
            position: absolute;
            left: 15px;
            width: 45%;
            padding-right: 10px;
            white-space: nowrap;
            text-align: left;
            font-weight: bold;
          }
        }
      </style>
  <div style="display: flex; flex-wrap: wrap; gap: 10px; margin-bottom: 15px; justify-content: space-between;">
  <div style="flex: 1; min-width: 130px;">
    <label style="font-weight: 600;">Desde:</label>
    <input type="date" id="desdeInput" value="${desdeValue}" style="width: 100%; padding: 6px 10px; border-radius: 5px; border: 1px solid #ccc;">
  </div>
  <div style="flex: 1; min-width: 130px;">
    <label style="font-weight: 600;">Hasta:</label>
    <input type="date" id="hastaInput" value="${hastaValue}" style="width: 100%; padding: 6px 10px; border-radius: 5px; border: 1px solid #ccc;">
  </div>
  <div style="display: flex; align-items: end;">
    <button id="btnReporte" style="background-color: #3E5F8A; color: white; padding: 8px 18px; border: none; border-radius: 8px; font-weight: 600; cursor: pointer;">
      📄 Generar reporte
    </button>
  </div>
</div>
    <br>
    <div style="overflow-x: auto; max-height: 300px; overflow-y: auto;">
      <table class="responsive-table" style="width: 100%; border-collapse: collapse; font-size: 14px;">
        <thead>
          <tr style="background-color: #f2f2f2;">
            <th style="border: 1px solid #ccc; padding: 8px;">#</th>
            <th style="border: 1px solid #ccc; padding: 8px;">Fecha</th>
            <th style="border: 1px solid #ccc; padding: 8px;">Hora</th>
            <th style="border: 1px solid #ccc; padding: 8px;">Motivo</th>
            <th style="border: 1px solid #ccc; padding: 8px;">Justificada</th>
            <th style="border: 1px solid #ccc; padding: 8px;">Comentario</th>
            <th style="border: 1px solid #ccc; padding: 8px;">E/S</th>
          </tr>
        </thead>
        <tbody>
          ${data.length > 0 ? data.map((item, i) => `
            <tr>
              <td style="border: 1px solid #ccc; padding: 8px;">${i + 1}</td>
              <td style="border: 1px solid #ccc; padding: 8px;"> ${item.fecha ? new Date(item.fecha).toISOString().split('T')[0] : ''}</td>
              <td style="border: 1px solid #ccc; padding: 8px;">${item.capturated ? this.formatearHora(item.capturated) : ''}</td>
              <td style="border: 1px solid #ccc; padding: 8px;">${item.motivo || ''}</td>
              <td style="border: 1px solid #ccc; padding: 8px;">${item.justificada ? 'Sí' : 'No'}</td>
              <td style="border: 1px solid #ccc; padding: 8px;">${item.comentarios || ''}</td>
              <td style="border: 1px solid #ccc; padding: 8px;">${item.ES || ''}</td>
            </tr>
          `).join('') : `<tr><td colspan="7" style="text-align:center; padding: 8px;">Sin datos</td></tr>`}
        </tbody>
      </table>
    </div>
  `;

    // Función para cargar datos desde el endpoint y actualizar el swal
    const cargarDatos = (desde: string, hasta: string) => {
      const desdeFormatted = new Date(desde).toISOString().split('T')[0];
      const hastaFormatted = new Date(hasta).toISOString().split('T')[0];

      this.rh.getAttencendanceById(persona.employeeid, 3, desdeFormatted, hastaFormatted, 0, 50)
        .subscribe((response: ApiResponse) => {
          dataTabla = response.data || []; // ✅ AQUÍ
          fechaDesde = desdeFormatted;     // ✅ y AQUÍ
          fechaHasta = hastaFormatted;
          Swal.update({
            html: htmlContent(response.data, desdeFormatted, hastaFormatted)
          });

          setTimeout(() => {
            const desdeInput = document.getElementById('desdeInput') as HTMLInputElement;
            const hastaInput = document.getElementById('hastaInput') as HTMLInputElement;

            const buscar = () => {
              const desde = desdeInput.value;
              const hasta = hastaInput.value;
              if (desde && hasta) cargarDatos(desde, hasta);
            };

            desdeInput?.addEventListener('change', buscar);
            hastaInput?.addEventListener('change', buscar);

            const btn = document.getElementById('btnReporte');
            btn?.addEventListener('click', () => {

              if (!dataTabla || dataTabla.length === 0) {
                Swal.fire('Sin datos', 'No hay información para generar el PDF.', 'warning');
                return;
              }
              this.generarReportePDF(dataTabla, fechaDesde, fechaHasta, persona.name, 'Reporte de justificantes');
              this.generarReporteExcel(dataTabla, fechaDesde, fechaHasta, persona.name, 'Reporte de Retardos');
              Swal.fire('Reporte generado', 'Tu archivo ha sido descargado.', 'success');
            });
          }, 0);
        });
    };

    // Primer Swal
    Swal.fire({
      title: `<strong>Asistencias justificadas de ${persona.name}</strong>`,
      html: htmlContent([]),
      width: 700,
      showConfirmButton: false,
      showCloseButton: true,
      customClass: { popup: 'swal-wide' },
      didOpen: () => {
        const desdeInput = document.getElementById('desdeInput') as HTMLInputElement;
        const hastaInput = document.getElementById('hastaInput') as HTMLInputElement;

        const buscar = () => {
          const desde = desdeInput.value;
          const hasta = hastaInput.value;
          if (desde && hasta) cargarDatos(desde, hasta);
        };

        desdeInput?.addEventListener('change', buscar);
        hastaInput?.addEventListener('change', buscar);


        // Cargar datos por primera vez
        buscar();
      }
    });
  }

  abrirSwalFaltas(persona: Persona) {
    const fechaHoy = new Date().toISOString().split('T')[0];
    let dataTabla: any[] = [];
    let fechaDesde = fechaHoy;
    let fechaHasta = fechaHoy;


    // Función para generar el HTML con los datos
    const htmlContent = (data: any[] = [], desdeValue = fechaHoy, hastaValue = fechaHoy) => `
           <style>

        @media screen and (max-width: 600px) {
          .responsive-table thead {
            display: none;
          }
          .responsive-table, .responsive-table tbody, .responsive-table tr, .responsive-table td {
            display: block;
            width: 100%;
          }
          .responsive-table tr {
            margin-bottom: 15px;
            border: 1px solid #ccc;
            border-radius: 5px;
            padding: 10px;
          }
          .responsive-table td {
            text-align: right;
            position: relative;
            padding-left: 50%;
          }
          .responsive-table td::before {
            content: attr(data-label);
            position: absolute;
            left: 15px;
            width: 45%;
            padding-right: 10px;
            white-space: nowrap;
            text-align: left;
            font-weight: bold;
          }
        }
      </style>
  <div style="display: flex; flex-wrap: wrap; gap: 10px; margin-bottom: 15px; justify-content: space-between;">
  <div style="flex: 1; min-width: 130px;">
    <label style="font-weight: 600;">Desde:</label>
    <input type="date" id="desdeInput" value="${desdeValue}" style="width: 100%; padding: 6px 10px; border-radius: 5px; border: 1px solid #ccc;">
  </div>
  <div style="flex: 1; min-width: 130px;">
    <label style="font-weight: 600;">Hasta:</label>
    <input type="date" id="hastaInput" value="${hastaValue}" style="width: 100%; padding: 6px 10px; border-radius: 5px; border: 1px solid #ccc;">
  </div>
  <div style="display: flex; align-items: end;">
    <button id="btnReporte" style="background-color: #3E5F8A; color: white; padding: 8px 18px; border: none; border-radius: 8px; font-weight: 600; cursor: pointer;">
      📄 Generar reporte
    </button>
  </div>
</div>
    <br>
    <div style="overflow-x: auto; max-height: 300px; overflow-y: auto;">
      <table class="responsive-table" style="width: 100%; border-collapse: collapse; font-size: 14px;">
        <thead>
          <tr style="background-color: #f2f2f2;">
            <th style="border: 1px solid #ccc; padding: 8px;">#</th>
            <th style="border: 1px solid #ccc; padding: 8px;">Fecha</th>
            <th style="border: 1px solid #ccc; padding: 8px;">Hora</th>
            <th style="border: 1px solid #ccc; padding: 8px;">Motivo</th>
            <th style="border: 1px solid #ccc; padding: 8px;">Justificada</th>
            <th style="border: 1px solid #ccc; padding: 8px;">Comentario</th>
            <th style="border: 1px solid #ccc; padding: 8px;">E/S</th>
          </tr>
        </thead>
        <tbody>
          ${data.length > 0 ? data.map((item, i) => `
            <tr>
              <td style="border: 1px solid #ccc; padding: 8px;">${i + 1}</td>
              <td style="border: 1px solid #ccc; padding: 8px;"> ${item.fecha ? new Date(item.fecha).toISOString().split('T')[0] : ''}</td>
              <td style="border: 1px solid #ccc; padding: 8px;">${item.capturated ? this.formatearHora(item.capturated) : ''}</td>
              <td style="border: 1px solid #ccc; padding: 8px;">${item.motivo || ''}</td>
              <td style="border: 1px solid #ccc; padding: 8px;">${item.justificada ? 'Sí' : 'No'}</td>
              <td style="border: 1px solid #ccc; padding: 8px;">${item.comentarios || ''}</td>
              <td style="border: 1px solid #ccc; padding: 8px;">${item.ES || ''}</td>
            </tr>
          `).join('') : `<tr><td colspan="7" style="text-align:center; padding: 8px;">Sin datos</td></tr>`}
        </tbody>
      </table>
    </div>
  `;

    // Función para cargar datos desde el endpoint y actualizar el swal
    const cargarDatos = (desde: string, hasta: string) => {
      const desdeFormatted = new Date(desde).toISOString().split('T')[0];
      const hastaFormatted = new Date(hasta).toISOString().split('T')[0];

      this.rh.getAttencendanceById(persona.employeeid, 2, desdeFormatted, hastaFormatted, 0, 50)
        .subscribe((response: ApiResponse) => {
          dataTabla = response.data || []; // ✅ AQUÍ
          fechaDesde = desdeFormatted;     // ✅ y AQUÍ
          fechaHasta = hastaFormatted;
          Swal.update({
            html: htmlContent(response.data, desdeFormatted, hastaFormatted)
          });

          setTimeout(() => {
            const desdeInput = document.getElementById('desdeInput') as HTMLInputElement;
            const hastaInput = document.getElementById('hastaInput') as HTMLInputElement;

            const buscar = () => {
              const desde = desdeInput.value;
              const hasta = hastaInput.value;
              if (desde && hasta) cargarDatos(desde, hasta);
            };

            desdeInput?.addEventListener('change', buscar);
            hastaInput?.addEventListener('change', buscar);

            const btn = document.getElementById('btnReporte');
            btn?.addEventListener('click', () => {


              if (!dataTabla || dataTabla.length === 0) {
                Swal.fire('Sin datos', 'No hay información para generar el PDF.', 'warning');
                return;
              }
              this.generarReportePDF(dataTabla, fechaDesde, fechaHasta, persona.name, 'Reporte de Faltas');
              this.generarReporteExcel(dataTabla, fechaDesde, fechaHasta, persona.name, 'Reporte de Faltas');
              Swal.fire('Reporte generado', 'Tu archivo ha sido descargado.', 'success');
            });
          }, 0);
        });
    };

    // Primer Swal
    Swal.fire({
      title: `<strong>Faltas de ${persona.name}</strong>`,
      html: htmlContent([]),
      width: 700,
      showConfirmButton: false,
      showCloseButton: true,
      customClass: { popup: 'swal-wide' },
      didOpen: () => {
        const desdeInput = document.getElementById('desdeInput') as HTMLInputElement;
        const hastaInput = document.getElementById('hastaInput') as HTMLInputElement;

        const buscar = () => {
          const desde = desdeInput.value;
          const hasta = hastaInput.value;
          if (desde && hasta) cargarDatos(desde, hasta);
        };

        desdeInput?.addEventListener('change', buscar);
        hastaInput?.addEventListener('change', buscar);


        // Cargar datos por primera vez
        buscar();
      }
    });
  }


  abrirSwalInasistencias(persona: Persona) {
    const fechaHoy = new Date().toISOString().split('T')[0];
    let dataTabla: any[] = [];
    let fechaDesde = fechaHoy;
    let fechaHasta = fechaHoy;
    console.log(dataTabla);

    // Función para generar el HTML con los datos
    const htmlContent = (data: any[] = [], desdeValue = fechaHoy, hastaValue = fechaHoy) => `
           <style>

        @media screen and (max-width: 600px) {
          .responsive-table thead {
            display: none;
          }
          .responsive-table, .responsive-table tbody, .responsive-table tr, .responsive-table td {
            display: block;
            width: 100%;
          }
          .responsive-table tr {
            margin-bottom: 15px;
            border: 1px solid #ccc;
            border-radius: 5px;
            padding: 10px;
          }
          .responsive-table td {
            text-align: right;
            position: relative;
            padding-left: 50%;
          }
          .responsive-table td::before {
            content: attr(data-label);
            position: absolute;
            left: 15px;
            width: 45%;
            padding-right: 10px;
            white-space: nowrap;
            text-align: left;
            font-weight: bold;
          }
        }
      </style>
  <div style="display: flex; flex-wrap: wrap; gap: 10px; margin-bottom: 15px; justify-content: space-between;">
  <div style="flex: 1; min-width: 130px;">
    <label style="font-weight: 600;">Desde:</label>
    <input type="date" id="desdeInput" value="${desdeValue}" style="width: 100%; padding: 6px 10px; border-radius: 5px; border: 1px solid #ccc;">
  </div>
  <div style="flex: 1; min-width: 130px;">
    <label style="font-weight: 600;">Hasta:</label>
    <input type="date" id="hastaInput" value="${hastaValue}" style="width: 100%; padding: 6px 10px; border-radius: 5px; border: 1px solid #ccc;">
  </div>
  <div style="display: flex; align-items: end;">
    <button id="btnReporte" style="background-color: #3E5F8A; color: white; padding: 8px 18px; border: none; border-radius: 8px; font-weight: 600; cursor: pointer;">
      📄 Generar reporte
    </button>
  </div>
</div>
    <br>
    <div style="overflow-x: auto; max-height: 300px; overflow-y: auto;">
      <table class="responsive-table" style="width: 100%; border-collapse: collapse; font-size: 14px;">
        <thead>
          <tr style="background-color: #f2f2f2;">
            <th style="border: 1px solid #ccc; padding: 8px;">#</th>
            <th style="border: 1px solid #ccc; padding: 8px;">Fecha</th>
            <th style="border: 1px solid #ccc; padding: 8px;">Hora</th>
            <th style="border: 1px solid #ccc; padding: 8px;">Motivo</th>
            <th style="border: 1px solid #ccc; padding: 8px;">Justificada</th>
            <th style="border: 1px solid #ccc; padding: 8px;">Comentario</th>
            <th style="border: 1px solid #ccc; padding: 8px;">E/S</th>
          </tr>
        </thead>
        <tbody>
          ${data.length > 0 ? data.map((item, i) => `
            
            <tr>
              <td style="border: 1px solid #ccc; padding: 8px;">${i + 1}</td>
              <td style="border: 1px solid #ccc; padding: 8px;"> ${item.fecha ? new Date(item.fecha).toISOString().split('T')[0] : ''}</td>
              <td style="border: 1px solid #ccc; padding: 8px;">${item.capturated ? this.formatearHora(item.capturated) : ''}</td>
              <td style="border: 1px solid #ccc; padding: 8px;">${item.motivo || ''}</td>
              <td style="border: 1px solid #ccc; padding: 8px;">${item.justificada ? 'Sí' : 'No'}</td>
              <td style="border: 1px solid #ccc; padding: 8px;">${item.comentarios || ''}</td>
              <td style="border: 1px solid #ccc; padding: 8px;">${item.ES || ''}</td>
            </tr>
          `).join('') : `<tr><td colspan="7" style="text-align:center; padding: 8px;">Sin datos</td></tr>`}
        </tbody>
      </table>
    </div>
  `;

    // Función para cargar datos desde el endpoint y actualizar el swal
    const cargarDatos = (desde: string, hasta: string) => {
      const desdeFormatted = new Date(desde).toISOString().split('T')[0];
      const hastaFormatted = new Date(hasta).toISOString().split('T')[0];

      this.rh.getAttencendanceById(persona.employeeid, 1, desdeFormatted, hastaFormatted, 0, 50)
        .subscribe((response: ApiResponse) => {
          dataTabla = response.data || []; // ✅ AQUÍ
          fechaDesde = desdeFormatted;     // ✅ y AQUÍ
          fechaHasta = hastaFormatted;

          Swal.update({
            html: htmlContent(response.data, desdeFormatted, hastaFormatted)
          });

          setTimeout(() => {
            const desdeInput = document.getElementById('desdeInput') as HTMLInputElement;
            const hastaInput = document.getElementById('hastaInput') as HTMLInputElement;

            const buscar = () => {
              const desde = desdeInput.value;
              const hasta = hastaInput.value;
              if (desde && hasta) cargarDatos(desde, hasta);
            };

            desdeInput?.addEventListener('change', buscar);
            hastaInput?.addEventListener('change', buscar);

            const btn = document.getElementById('btnReporte');
            btn?.addEventListener('click', () => {

              if (!dataTabla || dataTabla.length === 0) {
                Swal.fire('Sin datos', 'No hay información para generar el PDF.', 'warning');
                return;
              }
              this.generarReportePDF(dataTabla, fechaDesde, fechaHasta, persona.name, 'Reporte de Asistencias');
              this.generarReporteExcel(dataTabla, fechaDesde, fechaHasta, persona.name, 'Reporte de Asistencias');
              Swal.fire('Reporte generado', 'Tu archivo ha sido descargado.', 'success');
            });
          }, 0);
        });
    };

    // Primer Swal
    Swal.fire({
      title: `<strong>Asistencias de ${persona.name}</strong>`,
      html: htmlContent([]),
      width: 700,
      showConfirmButton: false,
      showCloseButton: true,
      customClass: { popup: 'swal-wide' },
      didOpen: () => {
        const desdeInput = document.getElementById('desdeInput') as HTMLInputElement;
        const hastaInput = document.getElementById('hastaInput') as HTMLInputElement;

        const buscar = () => {
          const desde = desdeInput.value;
          const hasta = hastaInput.value;
          if (desde && hasta) cargarDatos(desde, hasta);
        };

        desdeInput?.addEventListener('change', buscar);
        hastaInput?.addEventListener('change', buscar);


        // Cargar datos por primera vez
        buscar();
      }
    });
  }

  abrirSwalRetardos(persona: Persona) {
    const fechaHoy = new Date().toISOString().split('T')[0];
    let dataTabla: any[] = [];
    let fechaDesde = fechaHoy;
    let fechaHasta = fechaHoy;

    // Función para generar el HTML con los datos
    const htmlContent = (data: any[] = [], desdeValue = fechaHoy, hastaValue = fechaHoy) => `
           <style>

        @media screen and (max-width: 600px) {
          .responsive-table thead {
            display: none;
          }
          .responsive-table, .responsive-table tbody, .responsive-table tr, .responsive-table td {
            display: block;
            width: 100%;
          }
          .responsive-table tr {
            margin-bottom: 15px;
            border: 1px solid #ccc;
            border-radius: 5px;
            padding: 10px;
          }
          .responsive-table td {
            text-align: right;
            position: relative;
            padding-left: 50%;
          }
          .responsive-table td::before {
            content: attr(data-label);
            position: absolute;
            left: 15px;
            width: 45%;
            padding-right: 10px;
            white-space: nowrap;
            text-align: left;
            font-weight: bold;
          }
        }
      </style>
  <div style="display: flex; flex-wrap: wrap; gap: 10px; margin-bottom: 15px; justify-content: space-between;">
  <div style="flex: 1; min-width: 130px;">
    <label style="font-weight: 600;">Desde:</label>
    <input type="date" id="desdeInput" value="${desdeValue}" style="width: 100%; padding: 6px 10px; border-radius: 5px; border: 1px solid #ccc;">
  </div>
  <div style="flex: 1; min-width: 130px;">
    <label style="font-weight: 600;">Hasta:</label>
    <input type="date" id="hastaInput" value="${hastaValue}" style="width: 100%; padding: 6px 10px; border-radius: 5px; border: 1px solid #ccc;">
  </div>
  <div style="display: flex; align-items: end;">
    <button id="btnReporte" style="background-color: #3E5F8A; color: white; padding: 8px 18px; border: none; border-radius: 8px; font-weight: 600; cursor: pointer;">
      📄 Generar reporte
    </button>
  </div>
</div>
    <br>
    <div style="overflow-x: auto; max-height: 300px; overflow-y: auto;">
      <table class="responsive-table" style="width: 100%; border-collapse: collapse; font-size: 14px;">
        <thead>
          <tr style="background-color: #f2f2f2;">
            <th style="border: 1px solid #ccc; padding: 8px;">#</th>
            <th style="border: 1px solid #ccc; padding: 8px;">Fecha</th>
            <th style="border: 1px solid #ccc; padding: 8px;">Hora</th>
            <th style="border: 1px solid #ccc; padding: 8px;">Motivo</th>
            <th style="border: 1px solid #ccc; padding: 8px;">Justificada</th>
            <th style="border: 1px solid #ccc; padding: 8px;">Comentario</th>
            <th style="border: 1px solid #ccc; padding: 8px;">E/S</th>
          </tr>
        </thead>
        <tbody>
          ${data.length > 0 ? data.map((item, i) => `
            <tr>
              <td style="border: 1px solid #ccc; padding: 8px;">${i + 1}</td>
              <td style="border: 1px solid #ccc; padding: 8px;"> ${item.fecha ? new Date(item.fecha).toISOString().split('T')[0] : ''}</td>
              <td style="border: 1px solid #ccc; padding: 8px;">${item.capturated ? this.formatearHora(item.capturated) : ''}</td>
              <td style="border: 1px solid #ccc; padding: 8px;">${item.motivo || ''}</td>
              <td style="border: 1px solid #ccc; padding: 8px;">${item.justificada ? 'Sí' : 'No'}</td>
              <td style="border: 1px solid #ccc; padding: 8px;">${item.comentarios || ''}</td>
              <td style="border: 1px solid #ccc; padding: 8px;">${item.ES || ''}</td>
            </tr>
          `).join('') : `<tr><td colspan="7" style="text-align:center; padding: 8px;">Sin datos</td></tr>`}
        </tbody>
      </table>
    </div>
  `;

    // Función para cargar datos desde el endpoint y actualizar el swal
    const cargarDatos = (desde: string, hasta: string) => {
      const desdeFormatted = new Date(desde).toISOString().split('T')[0];
      const hastaFormatted = new Date(hasta).toISOString().split('T')[0];

      this.rh.getAttencendanceById(persona.employeeid, 5, desdeFormatted, hastaFormatted, 0, 50)
        .subscribe((response: ApiResponse) => {

          Swal.update({
            html: htmlContent(response.data, desdeFormatted, hastaFormatted)
          });
          dataTabla = response.data || []; // ✅ AQUÍ
          fechaDesde = desdeFormatted;     // ✅ y AQUÍ
          fechaHasta = hastaFormatted;

          setTimeout(() => {
            const desdeInput = document.getElementById('desdeInput') as HTMLInputElement;
            const hastaInput = document.getElementById('hastaInput') as HTMLInputElement;

            const buscar = () => {
              const desde = desdeInput.value;
              const hasta = hastaInput.value;
              if (desde && hasta) cargarDatos(desde, hasta);
            };

            desdeInput?.addEventListener('change', buscar);
            hastaInput?.addEventListener('change', buscar);

            const btn = document.getElementById('btnReporte');
            btn?.addEventListener('click', () => {


              if (!dataTabla || dataTabla.length === 0) {
                Swal.fire('Sin datos', 'No hay información para generar el PDF.', 'warning');
                return;
              }
              this.generarReportePDF(dataTabla, fechaDesde, fechaHasta, persona.name, 'Reporte de Retardos');
              this.generarReporteExcel(dataTabla, fechaDesde, fechaHasta, persona.name, 'Reporte de Retardos');
              Swal.fire('Reporte generado', 'Tu archivo ha sido descargado.', 'success');
            });
          }, 0);
        });
    };

    // Primer Swal
    Swal.fire({
      title: `<strong>Retardos de ${persona.name}</strong>`,
      html: htmlContent([]),
      width: 700,
      showConfirmButton: false,
      showCloseButton: true,
      customClass: { popup: 'swal-wide' },
      didOpen: () => {
        const desdeInput = document.getElementById('desdeInput') as HTMLInputElement;
        const hastaInput = document.getElementById('hastaInput') as HTMLInputElement;


        const buscar = () => {
          const desde = desdeInput.value;
          const hasta = hastaInput.value;
          if (desde && hasta) cargarDatos(desde, hasta);
        };

        desdeInput?.addEventListener('change', buscar);
        hastaInput?.addEventListener('change', buscar);
        // Cargar datos por primera vez
        buscar();
      }
    });
  }

  async seleccionarDiaNoLaboral(): Promise<void> {
    const { value: formValues } = await Swal.fire({
      title: '📅 Registrar día no laboral',
      html: `
      <div style="display: flex; flex-direction: column; align-items: start; gap: 1rem; font-size: 0.9rem; text-align: left;">
        <label style="font-weight: 600; width: 100%;">
          Fecha del día no laboral:
          <input type="date" id="swal-date" class="swal2-input" style="margin-top: 5px;" />
        </label>

        <label style="font-weight: 600; width: 100%;">
          Descripción:
          <input type="text" id="swal-description" class="swal2-input" placeholder="Ej. Día festivo, cierre anual..." style="margin-top: 5px;" />
        </label>

        <div style="font-weight: 600;">
          ¿Este día se repite cada año?
          <div style="margin-top: 5px; display: flex; flex-direction: column; gap: 0.25rem;">
            <label><input type="radio" name="recurrent" value="true" checked /> Sí, es recurrente</label>
            <label><input type="radio" name="recurrent" value="false" /> No, solo este año</label>
          </div>
        </div>
      </div>
    `,
      confirmButtonText: '✅ Guardar día',
      cancelButtonText: 'Cancelar',
      showCancelButton: true,
      focusConfirm: false,
      width: 500,
      customClass: {
        popup: 'swal-wide'
      },
      preConfirm: () => {
        const date = (document.getElementById('swal-date') as HTMLInputElement).value;
        const description = (document.getElementById('swal-description') as HTMLInputElement).value;
        const recurringStr = (document.querySelector('input[name="recurrent"]:checked') as HTMLInputElement)?.value;
        const recurring = recurringStr === 'true';

        if (!date || !description) {
          Swal.showValidationMessage('Por favor completa todos los campos.');
          return;
        }

        return { date, description, recurring };
      }
    });

    if (formValues) {
      this.rh.noWorkingDay(formValues).subscribe({
        next: () =>
          Swal.fire('¡Guardado!', 'El día no laboral fue registrado exitosamente.', 'success'),
        error: () =>
          Swal.fire('Error', 'Ocurrió un error al registrar el día no laboral.', 'error')
      });
    }
  }

  generarReportePDF(data: any[], desde: string, hasta: string, nombreEmpleado: string = 'Empleado', tituloReporte: string) {
    const fechaHoy = new Date().toLocaleDateString();

    const bodyTabla = [
      [
        { text: '#', style: 'tableHeader' },
        { text: 'Fecha', style: 'tableHeader' },
        { text: 'Hora', style: 'tableHeader' },
        { text: 'Motivo', style: 'tableHeader' },
        { text: 'Justificada', style: 'tableHeader' },
        { text: 'Comentario', style: 'tableHeader' },
        { text: 'E/S', style: 'tableHeader' }
      ],
      ...data.map((item, index) => [
        index + 1,
        item.fecha ? new Date(item.fecha).toISOString().split('T')[0] : '',
        item.capturated ? this.formatearHora(item.capturated) : '',
        item.motivo || '',
        item.justificada ? 'Sí' : 'No',
        item.comentarios || '',
        item.ES || ''
      ])
    ];

    const docDefinition = {
      content: [
        { text: `${tituloReporte}`, style: 'header', alignment: 'center' },
        { text: `Nombre del empleado: ${nombreEmpleado}`, style: 'subheader' },
        { text: `Rango de fechas: ${desde} a ${hasta}`, style: 'subheader' },
        { text: `Fecha de generación: ${fechaHoy}`, margin: [0, 0, 0, 10] },

        {
          style: 'tableExample',
          table: {
            headerRows: 1,
            widths: ['auto', '*', '*', '*', '*', '*', '*'],
            body: bodyTabla
          },
          layout: {
            fillColor: (rowIndex: number) => rowIndex === 0 ? '#eeeeee' : null,
            hLineColor: () => '#ccc',
            vLineColor: () => '#ccc'
          }
        }
      ],
      styles: {
        header: {
          fontSize: 18,
          bold: true,
          margin: [0, 0, 0, 10]
        },
        subheader: {
          fontSize: 12,
          margin: [0, 2, 0, 2]
        },
        tableHeader: {
          bold: true,
          fontSize: 11,
          color: 'black'
        }
      },
      defaultStyle: {
        fontSize: 10
      }
    };

    (pdfMake as any).createPdf(docDefinition).download(`reporte_asistencias_${nombreEmpleado}_${fechaHoy}.pdf`);

  }

  generarReporteExcel(data: any[], nombreEmpleado: string, desde: string, hasta: string, p0: string) {
    const fechaHoy = new Date().toLocaleDateString();

    // Mapeo de filas igual que en PDF
    const datosExcel = data.map((item, index) => ({
      '#': index + 1,
      'Fecha': item.fecha ? new Date(item.fecha).toISOString().split('T')[0] : '',
      'Hora': item.capturated ? this.formatearHora(item.capturated) : '',
      'Motivo': item.motivo || '',
      'Justificada': item.justificada ? 'Sí' : 'No',
      'Comentario': item.comentarios || '',
      'E/S': item.ES || ''
    }));

    // Crear hoja y libro
    const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(datosExcel);
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Reporte');

    // Exportar
    const excelBuffer: any = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
    const dataBlob: Blob = new Blob([excelBuffer], { type: 'application/octet-stream' });
    saveAs(dataBlob, `reporte_asistencias_${nombreEmpleado}_${fechaHoy}.xlsx`);
  }


}
