import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CRUDEmployeeComponent } from './crudemployee/crudemployee.component';
import { NewEmployeeComponent } from './new-employee/new-employee.component';
import { NewCarComponent } from './new-car/new-car.component';
import { InventoryComponent } from './inventory/inventory.component';
import { GraphsAssistanceComponent } from './graphs-assistance/graphs-assistance.component';
import { CheckAssistanceComponent } from './check-assistance/check-assistance.component';

const routes: Routes = [
  {path: 'Trabajadores-Registrados',component: CRUDEmployeeComponent},
  {path: 'Registrar-Trabajador',component: NewEmployeeComponent},
  {path: 'Registrar-Automovil',component: NewCarComponent},
  {path: 'Inventario',component: InventoryComponent},
  {path: 'Control-Asistencias',component: GraphsAssistanceComponent},
  {path: 'Registrar-Asistencias',component: CheckAssistanceComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RHRoutingModule {

 }
