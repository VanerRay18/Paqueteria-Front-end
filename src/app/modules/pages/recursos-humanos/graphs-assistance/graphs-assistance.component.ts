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
      title: `<strong>Justificantes pendientes de ${persona.nombre}</strong>`,
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
      title: `<strong>Justificantes de ${persona.nombre}</strong>`,
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
      title: `<strong>Asistencias de ${persona.nombre}</strong>`,
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
