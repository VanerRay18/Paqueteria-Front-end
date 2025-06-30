import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PackageTrackingCarComponent } from './package-tracking-car/package-tracking-car.component';
import { PackageTrackingComponent } from './package-tracking/package-tracking.component';
import { PakageTokenComponent } from './pakage-token/pakage-token.component';
import { PakageIncomingComponent } from './pakage-incoming/pakage-incoming.component';
import { DeliveryComponent } from './delivery/delivery.component';
import { DeliveryPackagesComponent } from './delivery-packages/delivery-packages.component';
import { SearchDeliveryComponent } from './search-delivery/search-delivery.component';

const routes: Routes = [
   {path: 'Registro-en-vehiculos',component: PackageTrackingCarComponent},
   {path: 'Registro-seguimiento/:id',component: PackageTrackingComponent},
   {path: 'Generacion-Token',component: PakageTokenComponent},
   {path: 'Carga-paquetes/:id',component: PakageIncomingComponent},
   {path: 'Entrega-paquetes', component: DeliveryComponent},
   {path: 'Paquetes-vehiculo/:id', component: DeliveryPackagesComponent},
   {path: 'Busqueda-Paquetes', component: SearchDeliveryComponent},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PaqueteriaRoutingModule { }
