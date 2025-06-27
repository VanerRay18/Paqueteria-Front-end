import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PackageTrackingCarComponent } from './package-tracking-car/package-tracking-car.component';
import { PackageTrackingComponent } from './package-tracking/package-tracking.component';
import { PakageTokenComponent } from './pakage-token/pakage-token.component';
import { PakageIncomingComponent } from './pakage-incoming/pakage-incoming.component';
import { DeliveryComponent } from './delivery/delivery.component';
import { DeliveryPackagesComponent } from './delivery-packages/delivery-packages.component';

const routes: Routes = [
   {path: 'Registro-en-vehiculos',component: PackageTrackingCarComponent},
   {path: 'Registro-seguimiento',component: PackageTrackingComponent},
   {path: 'Generacion-Token',component: PakageTokenComponent},
   {path: 'Carga-paquetes',component: PakageIncomingComponent},
   {path: 'Entrega-paquetes', component: DeliveryComponent},
   {path: 'Paquetes-vehiculo', component: DeliveryPackagesComponent},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PaqueteriaRoutingModule { }
