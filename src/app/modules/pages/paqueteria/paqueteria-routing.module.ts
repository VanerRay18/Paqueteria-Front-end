import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PackageTrackingCarComponent } from './package-tracking-car/package-tracking-car.component';
import { PackageTrackingComponent } from './package-tracking/package-tracking.component';
import { PakageTokenComponent } from './pakage-token/pakage-token.component';

const routes: Routes = [
   {path: 'Registro-en-vehiculos',component: PackageTrackingCarComponent},
   {path: 'Registro-seguimiento',component: PackageTrackingComponent},
   {path: 'Generacion-Token',component: PakageTokenComponent},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PaqueteriaRoutingModule { }
