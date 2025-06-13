import { Component } from '@angular/core';
import { VehicleCard } from 'src/app/shared/interfaces/utils';

@Component({
  selector: 'app-package-tracking-car',
  templateUrl: './package-tracking-car.component.html',
  styleUrls: ['./package-tracking-car.component.css']
})
export class PackageTrackingCarComponent {
 filtro: string = '';

vehicleCards: VehicleCard[] = [
  {
    placa: 'MCH4VH0Q',
    modelo: 'Nissan Versa',
    conductor: 'Juan Perez Sanchez',
    estado: 'En Ruta',
    entregados: 2,
    faltantes: 20,
    imagen: 'assets/nissan1.jpg'
  },
  {
    placa: 'XYZ1234',
    modelo: 'Toyota Hilux',
    conductor: 'Ana Lopez',
    estado: 'Entregado',
    entregados: 22,
    faltantes: 0,
    imagen: 'assets/nissan1.jpg'
  },
  // agrega más vehículos aquí
];


}
