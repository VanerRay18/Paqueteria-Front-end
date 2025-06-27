import { Component, OnInit } from '@angular/core';
import { FileTransferService } from 'src/app/services/file-transfer.service';

@Component({
  selector: 'app-delivery-packages',
  templateUrl: './delivery-packages.component.html',
  styleUrls: ['./delivery-packages.component.css']
})
export class DeliveryPackagesComponent implements OnInit {
  searchGuia: string = '';
  paqueteEncontrado: any = null;
  deliveryInfo: any = null;
  car: any;
  conductor: any;
  packageInformation: any = null;
  status: any;
  deliveryId: any;

  constructor(
        private fileTransferService: FileTransferService
  ) { }

  ngOnInit(): void {
    this.fileTransferService.currentIdTercero$
      .subscribe(id => {
        if (id !== null) {
          console.log('ID recibido:', id);
          this.deliveryId = id;
          // this.fileTransferService.clearIdTercero();
        }
      });
  }


    // Aquí puedes cargar la información de entrega si es necesario
    // this.cargarDeliveryInfo();


  buscarPaquete() {
    // Implementa la lógica para buscar el paquete por guía
    // this.pakage.searchPackageDelivery(this.searchGuia, this.deliveryId).subscribe(
    //   (response) => {
    //     if (response.data) {
    //       this.paqueteEncontrado = response.data;
    //       console.log('Paquete encontrado:', response.data);
    //     } else {
    //       this.paqueteEncontrado = null;
    //       Swal.fire('No encontrado', 'No se encontró el paquete.', 'warning');
    //     }
    //   },
    //   (error) => {
    //     console.error('Error al buscar el paquete:', error);
    //   }
    // );
  }

}
