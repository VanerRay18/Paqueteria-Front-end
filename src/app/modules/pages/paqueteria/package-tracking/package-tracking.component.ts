import { Component } from '@angular/core';
import * as Papa from 'papaparse';
import { PakageService } from 'src/app/services/pakage.service';
import Swal from 'sweetalert2';
import * as XLSX from 'xlsx';


@Component({
  selector: 'app-package-tracking',
  templateUrl: './package-tracking.component.html',
  styleUrls: ['./package-tracking.component.css']
})
export class PackageTrackingComponent {
  paquetesEsc: string[] = [];
  paqueteActual: string = '';

  constructor(
    private pakage: PakageService
  ) {

  }

  paquetes = [
    { codigo: 'JMX00238139845087145' },
    { codigo: 'JMX00238139845087145' },
    { codigo: 'JMX00238139845087145' },
    { codigo: 'JMX00238139845087145' },
    { codigo: 'JMX00238139845087145' },
    { codigo: 'JMX00238139845087145' }
  ];

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
    console.log(data)
    const incomingPackageId = 1; // Reemplaza con el ID real del paquete entrante
    this.pakage.SentDataExel(data, incomingPackageId).subscribe(
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
  const nuevosPaquetes = this.paquetesEsc.map(codigo => ({ codigo }));
  this.paquetes.push(...nuevosPaquetes); // agrega a la lista principal

  Swal.fire('¡Guardado!', `Se registraron ${nuevosPaquetes.length} paquetes.`, 'success');
}
    });
  }



}
