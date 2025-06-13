import { Component, OnInit } from '@angular/core';
import { ApiResponse } from 'src/app/models/ApiResponse';
import { RHService } from 'src/app/services/rh.service';
import { Persona } from 'src/app/shared/interfaces/utils';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-graphs-assistance',
  templateUrl: './graphs-assistance.component.html',
  styleUrls: ['./graphs-assistance.component.css']
})
export class GraphsAssistanceComponent implements OnInit {
  searchTerm: string = '';

  data: Persona[] = [];


  constructor(
    private rh: RHService
  ) {

  }

  ngOnInit(): void {
    this.getDatos();
    // Aquí podrías cargar los datos de las personas desde un servicio si fuera necesario
  }

   getDatos(){
    this.rh.getAttencendance().subscribe((response: ApiResponse) => {
      this.data = response.data;
    },
      (error) => {
        // console.error('Error al obtener los datos:', error);
        console.error('Ocurrio un error', error);
      });

   }

  abrirSwalPendientes(persona: Persona) {
Swal.fire({
      title: `<strong>Justificantes pendientes de ${persona.name}</strong>`,
      html: `
              <div style="margin-top: 20px; text-align: right;">
          <button id="btnReporte" style="background-color: #3E5F8A; color: white; padding: 8px 16px; border: none; border-radius: 5px; cursor: pointer;">
            Generar reporte
          </button>
        </div>
        <br>
        <div style="overflow-x: auto;">
          <table style="width: 100%; border-collapse: collapse; font-size: 14px;">
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
              <tr>
                <td style="border: 1px solid #ccc; padding: 8px;">1</td>
                <td style="border: 1px solid #ccc; padding: 8px;">01/05/2025</td>
                <td style="border: 1px solid #ccc; padding: 8px;">00:00</td>
                <td style="border: 1px solid #ccc; padding: 8px;">Inasistencia</td>
                <td style="border: 1px solid #ccc; padding: 8px;">No</td>
                <td style="border: 1px solid #ccc; padding: 8px;">Sin aviso</td>
                <td style="border: 1px solid #ccc; padding: 8px;">Entrada</td>
              </tr>
              <tr>
                <td style="border: 1px solid #ccc; padding: 8px;">2</td>
                <td style="border: 1px solid #ccc; padding: 8px;">08/05/2025</td>
                <td style="border: 1px solid #ccc; padding: 8px;">10:00</td>
                <td style="border: 1px solid #ccc; padding: 8px;">Tardanza</td>
                <td style="border: 1px solid #ccc; padding: 8px;">Sí</td>
                <td style="border: 1px solid #ccc; padding: 8px;">Retardo justificado por médico</td>
                <td style="border: 1px solid #ccc; padding: 8px;">Salida</td>
              </tr>
            </tbody>
          </table>
        </div>
      `,
      width: 700,
      showConfirmButton: false,
      showCloseButton: true,
      customClass: {
        popup: 'swal-wide'
      },
      didOpen: () => {
        const btn = document.getElementById('btnReporte');
        if (btn) {
          btn.addEventListener('click', () => {
            // Aquí colocas la lógica para generar el reporte
            Swal.fire('Reporte generado', 'Tu archivo ha sido descargado.', 'success');
          });
        }
      }
    });
  }

  abrirSwalJustificados(persona: Persona) {
Swal.fire({
      title: `<strong>Justificantes de ${persona.name}</strong>`,
      html: `
              <div style="margin-top: 20px; text-align: right;">
          <button id="btnReporte" style="background-color: #3E5F8A; color: white; padding: 8px 16px; border: none; border-radius: 5px; cursor: pointer;">
            Generar reporte
          </button>
        </div>
        <br>
        <div style="overflow-x: auto;">
          <table style="width: 100%; border-collapse: collapse; font-size: 14px;">
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
              <tr>
                <td style="border: 1px solid #ccc; padding: 8px;">1</td>
                <td style="border: 1px solid #ccc; padding: 8px;">01/05/2025</td>
                <td style="border: 1px solid #ccc; padding: 8px;">00:00</td>
                <td style="border: 1px solid #ccc; padding: 8px;">Inasistencia</td>
                <td style="border: 1px solid #ccc; padding: 8px;">No</td>
                <td style="border: 1px solid #ccc; padding: 8px;">Sin aviso</td>
                <td style="border: 1px solid #ccc; padding: 8px;">Entrada</td>
              </tr>
              <tr>
                <td style="border: 1px solid #ccc; padding: 8px;">2</td>
                <td style="border: 1px solid #ccc; padding: 8px;">08/05/2025</td>
                <td style="border: 1px solid #ccc; padding: 8px;">10:00</td>
                <td style="border: 1px solid #ccc; padding: 8px;">Tardanza</td>
                <td style="border: 1px solid #ccc; padding: 8px;">Sí</td>
                <td style="border: 1px solid #ccc; padding: 8px;">Retardo justificado por médico</td>
                <td style="border: 1px solid #ccc; padding: 8px;">Salida</td>
              </tr>
            </tbody>
          </table>
        </div>
      `,
      width: 700,
      showConfirmButton: false,
      showCloseButton: true,
      customClass: {
        popup: 'swal-wide'
      },
      didOpen: () => {
        const btn = document.getElementById('btnReporte');
        if (btn) {
          btn.addEventListener('click', () => {
            // Aquí colocas la lógica para generar el reporte
            Swal.fire('Reporte generado', 'Tu archivo ha sido descargado.', 'success');
          });
        }
      }
    });
  }

  abrirSwalFaltas(persona: Persona) {
    const fechaHoy = new Date().toISOString().split('T')[0];

    let htmlContent = (data: any[] = []) => `
      <div style="display: flex; gap: 10px; margin-bottom: 10px;">
        <label>Desde: <input type="date" id="desdeInput" value="${fechaHoy}"></label>
        <label>Hasta: <input type="date" id="hastaInput" value="${fechaHoy}"></label>
      </div>
      <div style="margin-top: 10px; text-align: right;">
        <button id="btnReporte" style="background-color: #3E5F8A; color: white; padding: 8px 16px; border: none; border-radius: 5px; cursor: pointer;">
          Generar reporte
        </button>
      </div>
      <br>
      <div style="overflow-x: auto; max-height: 300px; overflow-y: auto;">
        <table style="width: 100%; border-collapse: collapse; font-size: 14px;">
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
                <td style="border: 1px solid #ccc; padding: 8px;">${item.fecha || ''}</td>
                <td style="border: 1px solid #ccc; padding: 8px;">${item.hora || ''}</td>
                <td style="border: 1px solid #ccc; padding: 8px;">${item.motivo || ''}</td>
                <td style="border: 1px solid #ccc; padding: 8px;">${item.justificada ? 'Sí' : 'No'}</td>
                <td style="border: 1px solid #ccc; padding: 8px;">${item.comentario || ''}</td>
                <td style="border: 1px solid #ccc; padding: 8px;">${item.tipo || ''}</td>
              </tr>
            `).join('') : `<tr><td colspan="7" style="text-align:center; padding: 8px;">Sin datos</td></tr>`}
          </tbody>
        </table>
      </div>
    `;

    const cargarDatos = (desde: string, hasta: string) => {
      const desdeTimestamp = new Date(desde).getTime();
      const hastaTimestamp = new Date(hasta).getTime();
      console.log('Cargando datos desde:', desdeTimestamp, 'hasta:', hastaTimestamp);

      this.rh.getAttencendanceById(persona.employeeid, 2, desdeTimestamp, hastaTimestamp)
        .subscribe((response: ApiResponse) => {
          Swal.update({
            html: htmlContent(response.data)
          });
        });
    };

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

        desdeInput.addEventListener('change', buscar);
        hastaInput.addEventListener('change', buscar);

        const btn = document.getElementById('btnReporte');
        if (btn) {
          btn.addEventListener('click', () => {
            Swal.fire('Reporte generado', 'Tu archivo ha sido descargado.', 'success');
          });
        }

        // Carga inicial
        buscar();
      }
    });
  }





  abrirSwalInasistencias(persona: Persona) {
Swal.fire({
      title: `<strong>Asistencias de ${persona.name}</strong>`,
      html: `
              <div style="margin-top: 20px; text-align: right;">
          <button id="btnReporte" style="background-color: #3E5F8A; color: white; padding: 8px 16px; border: none; border-radius: 5px; cursor: pointer;">
            Generar reporte
          </button>
        </div>
        <br>
        <div style="overflow-x: auto;">
          <table style="width: 100%; border-collapse: collapse; font-size: 14px;">
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
              <tr>
                <td style="border: 1px solid #ccc; padding: 8px;">1</td>
                <td style="border: 1px solid #ccc; padding: 8px;">01/05/2025</td>
                <td style="border: 1px solid #ccc; padding: 8px;">00:00</td>
                <td style="border: 1px solid #ccc; padding: 8px;">Inasistencia</td>
                <td style="border: 1px solid #ccc; padding: 8px;">No</td>
                <td style="border: 1px solid #ccc; padding: 8px;">Sin aviso</td>
                <td style="border: 1px solid #ccc; padding: 8px;">Entrada</td>
              </tr>
              <tr>
                <td style="border: 1px solid #ccc; padding: 8px;">2</td>
                <td style="border: 1px solid #ccc; padding: 8px;">08/05/2025</td>
                <td style="border: 1px solid #ccc; padding: 8px;">10:00</td>
                <td style="border: 1px solid #ccc; padding: 8px;">Tardanza</td>
                <td style="border: 1px solid #ccc; padding: 8px;">Sí</td>
                <td style="border: 1px solid #ccc; padding: 8px;">Retardo justificado por médico</td>
                <td style="border: 1px solid #ccc; padding: 8px;">Salida</td>
              </tr>
            </tbody>
          </table>
        </div>
      `,
      width: 700,
      showConfirmButton: false,
      showCloseButton: true,
      customClass: {
        popup: 'swal-wide'
      },
      didOpen: () => {
        const btn = document.getElementById('btnReporte');
        if (btn) {
          btn.addEventListener('click', () => {
            // Aquí colocas la lógica para generar el reporte
            Swal.fire('Reporte generado', 'Tu archivo ha sido descargado.', 'success');
          });
        }
      }
    });
  }


}
