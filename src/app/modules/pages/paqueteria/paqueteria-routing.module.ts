import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PackageTrackingCarComponent } from './package-tracking-car/package-tracking-car.component';
import { PackageTrackingComponent } from './package-tracking/package-tracking.component';

const routes: Routes = [
   {path: 'Registro-en-vehiculos',component: PackageTrackingCarComponent},
   {path: 'Registro-seguimiento',component: PackageTrackingComponent},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PaqueteriaRoutingModule { }
