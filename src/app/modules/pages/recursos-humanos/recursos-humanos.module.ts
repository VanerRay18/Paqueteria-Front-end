import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NewEmployeeComponent } from './new-employee/new-employee.component';
import { CRUDEmployeeComponent } from './crudemployee/crudemployee.component';
import { CheckAssistanceComponent } from './check-assistance/check-assistance.component';
import { GraphsAssistanceComponent } from './graphs-assistance/graphs-assistance.component';
import { InventoryComponent } from './inventory/inventory.component';
import { NewCarComponent } from './new-car/new-car.component';
import { SharedModule } from "../../../shared/shared.module";
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { RHRoutingModule } from './rh-routing.module';



@NgModule({
  declarations: [
    NewEmployeeComponent,
    CRUDEmployeeComponent,
    CheckAssistanceComponent,
    GraphsAssistanceComponent,
    InventoryComponent,
    NewCarComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    FormsModule,
    ReactiveFormsModule,
    RHRoutingModule
]
})
export class RecursosHumanosModule { }
