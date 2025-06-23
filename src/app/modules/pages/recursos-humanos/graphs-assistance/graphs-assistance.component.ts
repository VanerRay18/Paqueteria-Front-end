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

  getDatos() {
    this.rh.getAttencendance().subscribe((response: ApiResponse) => {
      this.data = response.data;
    },
      (error) => {
        // console.error('Error al obtener los datos:', error);
        console.error('Ocurrio un error', error);
      });

  }

abrirSwalPendientes(persona: Persona) {
  const fechaHoy = new Date().toISOString().split('T')[0];

  const htmlContent = (data: any[] = [], desdeValue = fechaHoy, hastaValue = fechaHoy) => `
    <div style="display: flex; gap: 10px; margin-bottom: 10px;">
      <label>Desde: <input type="date" id="desdeInput" value="${desdeValue}"></label>
      <label>Hasta: <input type="date" id="hastaInput" value="${hastaValue}"></label>
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
            <th>#</th>
            <th>Fecha</th>
            <th>Hora</th>
            <th>Motivo</th>
            <th>Justificada</th>
            <th>Comentario</th>
            <th>E/S</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          ${data.length > 0 ? data.map((item, i) => `
            <tr>
              <td>${i + 1}</td>
              <td>${item.fecha ? new Date(item.fecha).toISOString().split('T')[0] : ''}</td>
              <td>${item.hora || ''}</td>
              <td>${item.motivo || ''}</td>
              <td>${item.justificada ? 'Sí' : 'No'}</td>
              <td>${item.comentarios || ''}</td>
              <td>${item.ES || ''}</td>
              <td><button class="btn-justificar" data-id="${item.id}" data-catid="${item.catId}" style="cursor:pointer;">✏️ Justificar</button></td>
            </tr>
          `).join('') : `<tr><td colspan="8" style="text-align:center;">Sin datos</td></tr>`}
        </tbody>
      </table>
    </div>
  `;

  const cargarDatos = (desde: string, hasta: string) => {
    const desdeFormatted = new Date(desde).toISOString().split('T')[0];
    const hastaFormatted = new Date(hasta).toISOString().split('T')[0];

    this.rh.getAttencendanceById(persona.employeeid, 4, desdeFormatted, hastaFormatted, 0, 50)
      .subscribe((response: ApiResponse) => {
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
            Swal.fire('Reporte generado', 'Tu archivo ha sido descargado.', 'success');
          });

          document.querySelectorAll('.btn-justificar').forEach(btn => {
            btn.addEventListener('click', () => {
              const attendanceId = (btn as HTMLElement).getAttribute('data-id');

              Swal.fire({
                title: 'Justificar Asistencia',
                html: `
                  <label>¿Justificada?</label>
                  <select id="selectJustificada" class="swal2-input">
                    <option value="true">Sí</option>
                    <option value="false">No</option>
                  </select>
                  <br>
                  <label>Descripción:</label>
                  <input type="text" id="descripcion" class="swal2-input" placeholder="Ej. Justificante médico">
                `,
                showCancelButton: true,
                confirmButtonText: 'Guardar',
                preConfirm: () => {
                  const justificada = (document.getElementById('selectJustificada') as HTMLSelectElement).value;
                  const descripcion = (document.getElementById('descripcion') as HTMLInputElement).value.trim();
                  const catId = (btn as HTMLElement).getAttribute('data-catid');
                  if (!descripcion) {
                    Swal.showValidationMessage('La descripción es obligatoria');
                    return;
                  }

                  return {
                    justificante: justificada === 'true',
                    catId: Number(catId),
                    descripcion
                  };
                }
              }).then(result => {
                if (result.isConfirmed && attendanceId) {
                  console.log('Justificante:', result.value, 'ID:', attendanceId);
                  this.rh.UpdateAttendance(result.value, attendanceId).subscribe(() => {
                    console.log('Justificante guardado:', result.value, attendanceId);
                    Swal.fire('¡Justificado!', 'La asistencia fue actualizada.', 'success');
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

      const btn = document.getElementById('btnReporte');
      btn?.addEventListener('click', () => {
        Swal.fire('Reporte generado', 'Tu archivo ha sido descargado.', 'success');
      });

      buscar(); // carga inicial
    }
  });
}



  abrirSwalJustificados(persona: Persona) {
   const fechaHoy = new Date().toISOString().split('T')[0];

    // Función para generar el HTML con los datos
    const htmlContent = (data: any[] = [], desdeValue = fechaHoy, hastaValue = fechaHoy) => `
    <div style="display: flex; gap: 10px; margin-bottom: 10px;">
      <label>Desde: <input type="date" id="desdeInput" value="${desdeValue}"></label>
      <label>Hasta: <input type="date" id="hastaInput" value="${hastaValue}"></label>
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
              <td style="border: 1px solid #ccc; padding: 8px;"> ${item.fecha ? new Date(item.fecha).toISOString().split('T')[0] : ''}</td>
              <td style="border: 1px solid #ccc; padding: 8px;">${item.hora || ''}</td>
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

        const btn = document.getElementById('btnReporte');
        btn?.addEventListener('click', () => {
          Swal.fire('Reporte generado', 'Tu archivo ha sido descargado.', 'success');
        });

        // Cargar datos por primera vez
        buscar();
      }
    });
  }

  abrirSwalFaltas(persona: Persona) {
   const fechaHoy = new Date().toISOString().split('T')[0];

    // Función para generar el HTML con los datos
    const htmlContent = (data: any[] = [], desdeValue = fechaHoy, hastaValue = fechaHoy) => `
    <div style="display: flex; gap: 10px; margin-bottom: 10px;">
      <label>Desde: <input type="date" id="desdeInput" value="${desdeValue}"></label>
      <label>Hasta: <input type="date" id="hastaInput" value="${hastaValue}"></label>
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
              <td style="border: 1px solid #ccc; padding: 8px;"> ${item.fecha ? new Date(item.fecha).toISOString().split('T')[0] : ''}</td>
              <td style="border: 1px solid #ccc; padding: 8px;">${item.hora || ''}</td>
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

        const btn = document.getElementById('btnReporte');
        btn?.addEventListener('click', () => {
          Swal.fire('Reporte generado', 'Tu archivo ha sido descargado.', 'success');
        });

        // Cargar datos por primera vez
        buscar();
      }
    });
  }






  abrirSwalInasistencias(persona: Persona) {
    const fechaHoy = new Date().toISOString().split('T')[0];

    // Función para generar el HTML con los datos
    const htmlContent = (data: any[] = [], desdeValue = fechaHoy, hastaValue = fechaHoy) => `
    <div style="display: flex; gap: 10px; margin-bottom: 10px;">
      <label>Desde: <input type="date" id="desdeInput" value="${desdeValue}"></label>
      <label>Hasta: <input type="date" id="hastaInput" value="${hastaValue}"></label>
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
              <td style="border: 1px solid #ccc; padding: 8px;"> ${item.fecha ? new Date(item.fecha).toISOString().split('T')[0] : ''}</td>
              <td style="border: 1px solid #ccc; padding: 8px;">${item.hora || ''}</td>
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

        const btn = document.getElementById('btnReporte');
        btn?.addEventListener('click', () => {
          Swal.fire('Reporte generado', 'Tu archivo ha sido descargado.', 'success');
        });

        // Cargar datos por primera vez
        buscar();
      }
    });
  }

  abrirSwalRetardos(persona: Persona) {
    const fechaHoy = new Date().toISOString().split('T')[0];

    // Función para generar el HTML con los datos
    const htmlContent = (data: any[] = [], desdeValue = fechaHoy, hastaValue = fechaHoy) => `
    <div style="display: flex; gap: 10px; margin-bottom: 10px;">
      <label>Desde: <input type="date" id="desdeInput" value="${desdeValue}"></label>
      <label>Hasta: <input type="date" id="hastaInput" value="${hastaValue}"></label>
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
              <td style="border: 1px solid #ccc; padding: 8px;"> ${item.fecha ? new Date(item.fecha).toISOString().split('T')[0] : ''}</td>
              <td style="border: 1px solid #ccc; padding: 8px;">${item.hora || ''}</td>
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

        const btn = document.getElementById('btnReporte');
        btn?.addEventListener('click', () => {
          Swal.fire('Reporte generado', 'Tu archivo ha sido descargado.', 'success');
        });

        // Cargar datos por primera vez
        buscar();
      }
    });
  }


}
