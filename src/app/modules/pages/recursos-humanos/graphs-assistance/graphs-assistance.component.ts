import { Component } from '@angular/core';
import Swal from 'sweetalert2';

interface Persona {
  nombre: string;
  usado: number;
  liquido: number;
  faltas: number;
  asistencias: number;
  retardos: number;
  total: number;
}

@Component({
  selector: 'app-graphs-assistance',
  templateUrl: './graphs-assistance.component.html',
  styleUrls: ['./graphs-assistance.component.css']
})
export class GraphsAssistanceComponent {
  searchTerm: string = '';

  personas: Persona[] = [
    { nombre: 'Juan Perez Sanchez', usado: 80, liquido: 100, faltas: 2, asistencias: 1,retardos:2, total: 0 },
    { nombre: 'Juan Perez Sanchez', usado: 90, liquido: 100, faltas: 1, asistencias: 0,retardos:2, total: 0 },
    { nombre: 'Juan Perez Sanchez', usado: 10, liquido: 100, faltas: 0, asistencias: 3,retardos:2, total: 0 },
    { nombre: 'Juan Perez Sanchez', usado: 75, liquido: 100, faltas: 1, asistencias: 1,retardos:2, total: 0 },
    { nombre: 'Juan Perez Sanchez', usado: 95, liquido: 100, faltas: 0, asistencias: 0,retardos:2, total: 0 },
    { nombre: 'Juan Perez Sanchez', usado: 100, liquido: 100, faltas: 3, asistencias: 2,retardos:2, total: 0 },
    { nombre: 'Juan Perez Sanchez', usado: 45, liquido: 100, faltas: 1, asistencias: 1,retardos:2, total: 0 },
    { nombre: 'Juan Perez Sanchez', usado: 88, liquido: 100, faltas: 0, asistencias: 0,retardos:2, total: 0 },
    { nombre: 'Juan Perez Sanchez', usado: 66, liquido: 100, faltas: 2, asistencias: 1,retardos:2, total: 0 },
  ];


  constructor() {
    this.personas = this.personas.map(p => ({
      ...p,
      total: p.faltas + p.asistencias + p.retardos,
    }));
  }

  get restante() {
    return (persona: Persona) => persona.liquido - persona.usado;
  }


  abrirSwalPendientes(persona: Persona) {
    Swal.fire({
      title: `Pendientes de ${persona.nombre}`,
      text: `Aquí iría el detalle de las faltas pendientes.`,
      icon: 'warning'
    });
  }

  abrirSwalJustificados(persona: Persona) {
    Swal.fire({
      title: `Justificados de ${persona.nombre}`,
      text: `Aquí iría el detalle de las inasistencias justificadas.`,
      icon: 'info'
    });
  }

  abrirSwalFaltas(persona: Persona) {
    Swal.fire({
      title: `<strong>Faltas de ${persona.nombre}</strong>`,
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



  abrirSwalInasistencias(persona: Persona) {
    Swal.fire({
      title: `Inasistencias de ${persona.nombre}`,
      text: `Tiene ${persona.asistencias} inasistencias.`,
      icon: 'success'
    });
  }

  mostrarDetalle(persona: Persona) {
    const restante = persona.liquido - persona.usado;
    const porcentaje = ((persona.usado / persona.liquido) * 100).toFixed(0);

    Swal.fire({
      title: `<h2 style="font-weight: bold; margin-bottom: 20px;">${persona.nombre}</h2>`,
      html: `
        <div style="text-align: center;">
          <!-- Barra principal -->
          <div style="display: flex; justify-content: space-around; margin-bottom: 10px; font-size: 12px;">
            <div>Usado</div>
            <div>Líquido</div>
            <div>Restante</div>
          </div>
          <div style="display: flex; justify-content: space-around; margin-bottom: 20px; font-weight: bold;">
            <div>${persona.usado}</div>
            <div>${persona.liquido}</div>
            <div>${restante}</div>
          </div>
          <div style="height: 20px; background: #ddd; border-radius: 10px; overflow: hidden; margin-bottom: 20px;">
            <div style="width: ${porcentaje}%; background: #621132; height: 100%;"></div>
          </div>

          <!-- Tabla de terceros -->
          <div style="text-align: left;">
            <p style="margin: 10px 0;"><strong>Terceros a los que está inscrito</strong> &nbsp;&nbsp;&nbsp;&nbsp; <strong style="float: right;">Total: 5</strong></p>
            ${this.generarTercerosHTML()}
          </div>
        </div>
      `,
      width: 700,
      showConfirmButton: false,
      showCloseButton: true,
      customClass: {
        popup: 'swal-wide'
      }
    });
  }

  generarTercerosHTML(): string {
    const terceros = [
      { nombre: 'ISSTE', deuda: 200000, abonado: 40000, quincena: '2Q 05/08', abonos: 1 },
      { nombre: 'ISSTE', deuda: 200000, abonado: 120000, quincena: '2Q 05/08', abonos: 3 },
      { nombre: 'ISSTE', deuda: 200000, abonado: 160000, quincena: '2Q 05/08', abonos: 4 },
      { nombre: 'ISSTE', deuda: 200000, abonado: 60000, quincena: '2Q 05/08', abonos: 1 },
      { nombre: 'ISSTE', deuda: 200000, abonado: 40000, quincena: '2Q 05/08', abonos: 1 }
    ];

    return terceros.map(t => {
      const porcentaje = ((t.abonado / t.deuda) * 100).toFixed(0);
      const color =
        +porcentaje > 80 ? '#0FA958' :
        +porcentaje > 50 ? '#FF6C11' : '#DC3E3E';

      return `
        <div style="margin-bottom: 15px;">
          <strong>${t.nombre}</strong><br>
          <small>Quincena de término: ${t.quincena}</small>
          <div style="height: 10px; background: #ddd; border-radius: 5px; overflow: hidden; margin: 4px 0;">
            <div style="width: ${porcentaje}%; background: ${color}; height: 100%;"></div>
          </div>
          <div style="font-size: 12px;">
            Total de la deuda: <strong>$${t.deuda.toLocaleString()}</strong> &nbsp;&nbsp;
            Abonado: <strong style="color: green;">$${t.abonado.toLocaleString()}</strong> &nbsp;&nbsp;
            <span style="float: right;">Abonos: ${t.abonos}</span>
          </div>
        </div>
      `;
    }).join('');
  }
}
