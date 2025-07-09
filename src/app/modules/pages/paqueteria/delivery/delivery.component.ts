import { Component, OnInit } from '@angular/core';
import { ApiResponse } from 'src/app/models/ApiResponse';
import { PakageService } from 'src/app/services/pakage.service';
import { OrgItem } from 'src/app/shared/interfaces/utils';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-delivery',
  templateUrl: './delivery.component.html',
  styleUrls: ['./delivery.component.css']
})
export class DeliveryComponent implements OnInit {
  searchGuia: string = '';
  paqueteEncontrado: any = null;
  deliveryInfo: any = null;
  car: any;
  conductor: any;
  packageInformation: any = null;
  status: any;
  deliveryId: any;
  catDex: any;
  selectedOrg: string = '';
  organizaciones: OrgItem[] = []; // Aquí se almacenan las organizaciones
  paquetesEsc: string[] = []; // Aquí puedes almacenar los paquetes encontrados
  isLoading: boolean = false;
  page: number = 0;
  size: number = 20;
  total: number = 0;
  rutaIniciada: boolean = false;
  paqueteStatus: any; // Aquí puedes almacenar el estado del paquete
  paquetes: any[] = []; // Aquí se almacenan los paquetes de la entrega
  searchTerm: string = '';
  image: any;
  cost: any;

  constructor(
    private pakage: PakageService // Replace with actual service type
  ) { }

  ngOnInit(): void {
    this.cargarDeliveryInfo();

    // Verificar el estado de la ruta al iniciar
    // Cargar los paquetes al iniciar el componente
    // Cargar organizaciones al iniciar el componente
  }

  get paquetesFiltrados() {
    if (!this.searchGuia || this.searchGuia.trim() === '') {
      return this.paquetes;
    }
    const filtro = this.searchGuia.toLowerCase();
    return this.paquetes.filter(p =>
      p.guia?.toLowerCase().includes(filtro)
    );
  }

  verificarEstadoRuta() {
    this.rutaIniciada = this.deliveryInfo?.status?.id === 7;
  }


  getData(page: number, size: number): void {
    this.isLoading = true;
    this.pakage.getPackageByDelivery(this.deliveryId, page, size).subscribe(
      response => {
        this.total = response.data.total
        this.paquetes = response.data.paquetes;
        // console.log('Paquetes:', this.paquetes);
        this.isLoading = false;
      },
      error => {
        console.error('Error al obtener los datos:', error);
        this.isLoading = false;
      }
    );
  }

  cambiarPagina(pagina: number) {
    this.page = pagina;
    this.getData(this.page, this.size);
  }



  cargarDeliveryInfo() {
    this.pakage.getDeliveryByEmployeeId().subscribe(
      (response: ApiResponse) => {
        if (response && response.data) {
          this.deliveryInfo = response.data;
          this.deliveryId = this.deliveryInfo.id; // Assuming the delivery ID is in the response
          this.car = this.deliveryInfo.car;
          this.cost = this.deliveryInfo.costoTotal;
          this.image = this.deliveryInfo.images;
          this.conductor = this.deliveryInfo.conductor;
          this.packageInformation = this.deliveryInfo.packageInformation;
          this.status = this.deliveryInfo.status;
          // console.log('Delivery info:', this.deliveryInfo);
          this.verificarEstadoRuta();
          this.getData(this.page, this.size);

        }
      },
      (error) => {
        console.error('Error al obtener delivery info:', error);
      }
    );

    this.pakage.getPDex().subscribe(
      (response: ApiResponse) => {
        if (response && response.data) {
          this.catDex = response.data;
        } else {
          console.warn('No se encontraron categorías Dex');
        }
      }
    );

  }

  buscarPaquete() {
    if (!this.searchGuia) return;

    this.pakage.searchPackageDelivery(this.searchGuia, this.deliveryId).subscribe(
      (response) => {
        if (response.data) {
          this.paqueteEncontrado = response.data;
          console.log('Paquete encontrado:', response.data);
        } else {
          this.paqueteEncontrado = null;
          Swal.fire('No encontrado', 'No se encontró el paquete.', 'warning');
        }
      },
      (error) => {
        console.error('Error al buscar:', error);
        Swal.fire('Error', 'Hubo un problema al buscar el paquete.', 'error');
      }
    );
  }

  verdetallesPaquete(paquete: any): void {
    const guia = paquete.guia;

    const d = paquete.consolidado;

    Swal.fire({
      title: `<strong>Datos del paquete</strong>`,
      html: `
            <div style="display: flex; flex-direction: column; gap: 1.2rem; font-size: 14px;">

              <!-- Consolidado -->
              <div style="padding: 12px; border-radius: 8px; background: #f1f5f9; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
                <h4 style="margin-bottom: 8px; color: #0f172a;">${guia}</h4>
                ${d ? `
                  <p><strong>Destino:</strong> ${d.destinationLocId} - ${d.recipCity}, ${d.recipState}</p>
                  <p><strong>Persona que recibe:</strong> ${d.recipName}</p>
                  <p><strong>Numero de Telefono:</strong> ${d.recipPhone}</p>
                  <p><strong>Referencias:</strong> ${d.shprRef}</p>
                ` : `<p>No hay información de consolidado</p>`}
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

  empezarRuta() {
    let catStatusId = 7; // Asumiendo que 1 es el ID para "Entregado"
    let packageId = this.deliveryId; // Asegúrate de que el paquete tenga un ID
    let description = 'Paquetes en ruta'; // Descripción de la acción
    this.pakage.updateDeliveryStatus(packageId, catStatusId, description).subscribe(
      (response) => {
        this.cargarDeliveryInfo();
        // Aquí iría la lógica para actualizar el estado en el backend si aplica
      },
      (error) => {
        console.error('Error al marcar como en ruta:', error);
      }
    );
  }

  terminarRuta() {
    const pendientes = this.paquetes.filter(p =>
      p.status?.id !== 8 && p.status?.id !== 9
    );

    if (pendientes.length > 0) {
      Swal.fire('Ruta incompleta', 'Debes entregar o marcar todos los paquetes antes de finalizar la ruta.', 'error');
      return;
    }

    let catStatusId = 10;
    let packageId = this.deliveryId; // Asegúrate de que el paquete tenga un ID
    let description = 'ruta terminada'; // Descripción de la acción
    this.pakage.updateDeliveryStatus(packageId, catStatusId, description).subscribe(
      (response) => {
        console.log('Marcado como no entregado:', response);
        this.cargarDeliveryInfo();
        this.ngOnInit();
        Swal.fire('Éxito', 'Ha terminado su ruta.', 'success');
        // Recargar la información de entrega
        // Aquí iría la lógica para actualizar el estado en el backend si aplica
      },
      (error) => {
        console.error('Error al marcar como no entregado:', error);
      }
    );
  }

  marcarEntregado(paquete: any) {
    let catStatusId = 8; // Asumiendo que 1 es el ID para "Entregado"
    let packageId = paquete.id; // Asegúrate de que el paquete tenga un ID
    let description = 'Paquete entregado';
    if (!this.rutaIniciada) {
      Swal.fire('Ruta no iniciada', 'Debes iniciar la ruta antes de marcar como entregado.', 'warning');
      return;
    } // Descripción de la acción
    this.pakage.updatePackageStatus(packageId, catStatusId, description).subscribe(
      (response) => {
        // console.log('Marcado como entregado:', paquete);

        Swal.fire('Éxito', 'Paquete marcado como entregado.', 'success');
        this.cargarDeliveryInfo(); // Recargar la información de entrega
        this.paqueteEncontrado = null;
        // Aquí iría la lógica para actualizar el estado en el backend si aplica
      },
      (error) => {
        console.error('Error al marcar como entregado:', error);
      }
    );
  }

  marcarNoEntregado(paquete: any) {
    let catStatusId = 9;
    let packageId = paquete.id; // Asegúrate de que el paquete tenga un ID
    let description = 'Paquete no entregado'; // Descripción de la acción
    const catDex = this.catDex || []; // Asegúrate de que catDex esté definido
    if (!this.rutaIniciada) {
      Swal.fire('Ruta no iniciada', 'Debes iniciar la ruta antes de marcar como entregado.', 'warning');
      return;
    }
    const selectHtml = `
    <select id="tipoSeguroSelect" style="
        width: 100%;
        padding: 0.75rem;
        font-size: 1rem;
        border-radius: 0.5rem;
        border: 1px solid #ccc;
        box-sizing: border-box;
        appearance: none;
      ">
      <option value="">Seleccione</option>
      ${catDex.map((dex: { id: any; description: any; type: any; }) => `
        <option value="${dex.id}">${dex.type} - ${dex.description}</option>
      `).join('')}
    </select>
  `;
    Swal.fire({
      title: 'Selecciona el motivo por el cual no se entregó el paquete',
      html: selectHtml,
      confirmButtonText: 'Aceptar',
      focusConfirm: false,
      preConfirm: () => {
        const selectedValue = (document.getElementById('tipoSeguroSelect') as HTMLSelectElement)?.value;
        if (!selectedValue) {
          Swal.showValidationMessage('Debes seleccionar un tipo de seguro');
          return false;
        }
        return selectedValue;
      }
    }).then((result) => {
      if (result.isConfirmed) {
        const selectedId = result.value;
        // console.log('ID seleccionado:', selectedId);
        this.pakage.updatePackageDex(packageId, selectedId).subscribe(
          (response) => {
            // console.log('Marcado como no entregado:', paquete);
            Swal.fire('Éxito', 'Paquete marcado como no entregado.', 'success');
            this.cargarDeliveryInfo();
            // Recargar la información de entrega
            this.paqueteEncontrado = null;
            // Aquí iría la lógica para actualizar el estado en el backend si aplica
          },
          (error) => {
            console.error('Error al marcar como no entregado:', error);
          }
        );
        // Puedes actualizar tu formGroup aquí si lo necesitas
      }
    });

  }



}
