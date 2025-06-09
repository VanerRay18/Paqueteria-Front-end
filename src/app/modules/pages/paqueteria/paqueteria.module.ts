import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PackageTrackingComponent } from './package-tracking/package-tracking.component';
import { PackageTrackingCarComponent } from './package-tracking-car/package-tracking-car.component';



@NgModule({
  declarations: [
    PackageTrackingComponent,
    PackageTrackingCarComponent
  ],
  imports: [
    CommonModule
  ]
})
export class PaqueteriaModule { }
