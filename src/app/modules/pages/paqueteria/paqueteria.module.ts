import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PackageTrackingComponent } from './package-tracking/package-tracking.component';
import { PackageTrackingCarComponent } from './package-tracking-car/package-tracking-car.component';
import { PaqueteriaRoutingModule } from './paqueteria-routing.module';
import { FormsModule } from '@angular/forms';
import { PakageTokenComponent } from './pakage-token/pakage-token.component';
import { PakageIncomingComponent } from './pakage-incoming/pakage-incoming.component';





@NgModule({
  declarations: [
    PackageTrackingComponent,
    PackageTrackingCarComponent,
    PakageTokenComponent,
    PakageIncomingComponent
  ],
  imports: [
    CommonModule,
    PaqueteriaRoutingModule,
    FormsModule
  ]
})
export class PaqueteriaModule { }
