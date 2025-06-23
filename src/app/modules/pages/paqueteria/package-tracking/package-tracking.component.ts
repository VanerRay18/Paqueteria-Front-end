import { Component, OnInit } from '@angular/core';
import * as Papa from 'papaparse';
import { PakageService } from 'src/app/services/pakage.service';
import Swal from 'sweetalert2';
import * as XLSX from 'xlsx';


@Component({
  selector: 'app-package-tracking',
  templateUrl: './package-tracking.component.html',
  styleUrls: ['./package-tracking.component.css']
})
export class PackageTrackingComponent  implements OnInit {
  paquetesEsc: string[] = [];
  paqueteActual: string = '';
  incomingPackageId: number = 1; // ID del paquete entrante, puedes cambiarlo según tu lógica
  paquetes: any[] = [];


  constructor(
    private pakage: PakageService
  ) {

  }
  ngOnInit(): void {
    this.getData(); // Llamar al método para obtener los datos al inicializar el componente
    // Inicializar el componente
  }

  getData(): void {
    this.pakage.getPackageByCarga(this.incomingPackageId, 0, 50).subscribe(
      response => {
        this.paquetes = response.data.packages; // Asignar los datos recibidos a la variable paquetes
        // console.log(response.data.packages);
      },
      error => {
        console.error('Error al obtener los datos:', error);
      }
    );
  } 

  getBarraEstado(paquete: any): string {
  const statusId = paquete.status?.id || 0;

  if (statusId <= 4) {
    return '0%'; // Solo en bodega lleno (barra vacía)
  } else if (statusId >= 5 && statusId <= 7) {
    // Avanza entre 33% y 66% según avance en ruta
    const porcentaje = 33 + ((statusId - 5 + 1) / 3) * 33; // 5 → 33%, 6 → 50%, 7 → 66%
    return `${porcentaje}%`;
  } else if (statusId >= 8) {
    return '100%'; // Entregado
  }

  return '0%';
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
    this.pakage.SentDataExel(data, this.incomingPackageId).subscribe(
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
      const nuevosPaquetes = [...this.paquetesEsc];

      // 👇 Llamada al servicio para enviar al backend
      this.pakage.paquetesEscaneados(nuevosPaquetes, this.incomingPackageId)
        .subscribe({
          next: (response) => {
            Swal.fire('¡Guardado!', `Se enviaron ${nuevosPaquetes.length} paquetes.`, 'success');
            this.getData(); // Actualizar la lista de paquetes después de enviar
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
