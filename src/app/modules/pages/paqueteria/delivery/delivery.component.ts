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

  selectedOrg: string = '';
  organizaciones: OrgItem[] = []; // Aquí se almacenan las organizaciones
  paquetesEsc: string[] = []; // Aquí puedes almacenar los paquetes encontrados
  minvalue: number = 0;
  maxvalue: number = 999;

  constructor(
    private pakage: PakageService // Replace with actual service type
  ) { }

  ngOnInit(): void {
    this.cargarDeliveryInfo();
    this.getOrganizaciones(); // Cargar organizaciones al iniciar el componente
  }

  getOrganizaciones() {
    this.pakage.getCatPakageOrg().subscribe({
      next: (response) => {
        const organizaciones: OrgItem[] = response.data || [];
        this.organizaciones = organizaciones;
      },
      error: (error) => {
        console.error('Error al obtener las organizaciones:', error);
      }
    });
  }

  cargarDeliveryInfo() {
    this.pakage.getDeliveryByEmployeeId().subscribe(
      (response: ApiResponse) => {
        if (response && response.data) {
          this.deliveryInfo = response.data;
          this.deliveryId = this.deliveryInfo.id; // Assuming the delivery ID is in the response
          this.car = this.deliveryInfo.car;
          this.conductor = this.deliveryInfo.conductor;
          this.packageInformation = this.deliveryInfo.packageInformation;
          this.status = this.deliveryInfo.status;
          console.log('Delivery info:', this.deliveryInfo);
        }
      },
      (error) => {
        console.error('Error al obtener delivery info:', error);
      }
    );
  }


  onOrgChange() {
    const selectedOrgData = this.organizaciones.find(org => org.id === Number(this.selectedOrg)); // Convierte selectedOrg a número
    if (selectedOrgData) {
      this.minvalue = selectedOrgData.config.config.minvalue;
      this.maxvalue = selectedOrgData.config.config.maxvalue;
    }
  }

  // Buscar el paquete
  buscarPaquete() {
    if (!this.searchGuia) return;

    const paqueteRecortado = this.searchGuia.length > this.maxvalue ? this.searchGuia.substring(0, this.maxvalue) : this.searchGuia;

    this.pakage.searchPackageDelivery(paqueteRecortado, this.deliveryId).subscribe(
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

  empezarRuta() {
    let catStatusId = 7; // Asumiendo que 1 es el ID para "Entregado"
    let packageId = this.deliveryId; // Asegúrate de que el paquete tenga un ID
    let description = 'Paquetes en ruta'; // Descripción de la acción
    console.log('Empezar ruta con ID de paquete:', packageId);
    this.pakage.updateDeliveryStatus(packageId, catStatusId, description).subscribe(
      (response) => {
        console.log('Marcado como en ruta:', response);
        this.cargarDeliveryInfo();
        // Aquí iría la lógica para actualizar el estado en el backend si aplica
      },
      (error) => {
        console.error('Error al marcar como en ruta:', error);
      }
    );
  }

  terminarRuta() {
    let catStatusId = 10;
    let packageId = this.deliveryId; // Asegúrate de que el paquete tenga un ID
    console.log('Terminar ruta con ID de paquete:', packageId);
    let description = 'ruta terminada'; // Descripción de la acción
    this.pakage.updateDeliveryStatus(packageId, catStatusId, description).subscribe(
      (response) => {
        console.log('Marcado como no entregado:', response);
        Swal.fire('Éxito', 'Paquete marcado como no entregado.', 'success');
        this.cargarDeliveryInfo();
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
    let description = 'Paquete entregado'; // Descripción de la acción
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
    this.pakage.updatePackageStatus(packageId, catStatusId, description).subscribe(
      (response) => {
        console.log('Marcado como no entregado:', paquete);
        Swal.fire('Éxito', 'Paquete marcado como no entregado.', 'success');
        this.cargarDeliveryInfo(); // Recargar la información de entrega
        this.paqueteEncontrado = null;
        // Aquí iría la lógica para actualizar el estado en el backend si aplica
      },
      (error) => {
        console.error('Error al marcar como no entregado:', error);
      }
    );
  }



}
