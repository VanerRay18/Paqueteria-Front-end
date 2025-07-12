import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PakagesComponent } from './pakages/pakages.component';
import { RHGraphsComponent } from './rhgraphs/rhgraphs.component';

const routes: Routes = [
  {path: 'Graficas-Paquetes',component: PakagesComponent},
  {path: 'Graficas-RH',component: RHGraphsComponent},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class GraphsRoutingModule { }
