import { Component, OnInit } from '@angular/core';
import { ApiResponse } from 'src/app/models/ApiResponse';
import { PakageService } from 'src/app/services/pakage.service';
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
  constructor(
    private pakage: PakageService // Replace with actual service type
  ) { }

  ngOnInit(): void {
    this.cargarDeliveryInfo();
  }

  cargarDeliveryInfo() {
    this.pakage.getDeliveryByEmployeeId().subscribe(
      (response: ApiResponse) => {
        if (response && response.data) {
          this.deliveryInfo = response.data;
          this.deliveryId = this.deliveryInfo.car.id; // Assuming the delivery ID is in the response
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

  marcarEntregado(paquete: any) {
    let catStatusId = 8; // Asumiendo que 1 es el ID para "Entregado"
    let packageId = paquete.id; // Asegúrate de que el paquete tenga un ID
    let description = 'Paquete entregado'; // Descripción de la acción
    this.pakage.updatePackageStatus(packageId, catStatusId, description).subscribe(
      (response) => {
        console.log('Marcado como entregado:', paquete);
        Swal.fire('Éxito', 'Paquete marcado como entregado.', 'success');
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
        // Aquí iría la lógica para actualizar el estado en el backend si aplica
      },
      (error) => {
        console.error('Error al marcar como no entregado:', error);
      }
    );
  }

}
