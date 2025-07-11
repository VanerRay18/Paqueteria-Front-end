import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';  // Importa FormsModule
import { NavComponent } from './header/nav/nav.component';
import { FomrsComponent } from './componentes/fomrs/fomrs.component';
import { TablesComponent } from './componentes/tables/tables.component';
import { FilterPipe } from './filter.pipe';
import { BusquedaComponent } from './componentes/busqueda/busqueda.component';
import { FooterComponent } from './header/footer/footer.component';
import { PaginadorComponentComponent } from './componentes/paginador-component/paginador-component.component';
import { ChartComponent } from './componentes/chart/chart.component';
import { NgChartsModule } from 'ng2-charts';

@NgModule({
  declarations: [
    NavComponent,
    FomrsComponent,
    TablesComponent,
    FilterPipe,
    BusquedaComponent,
    FooterComponent,
    PaginadorComponentComponent,
    ChartComponent
  ],
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    NgChartsModule  // Asegúrate de incluir FormsModule aquí
  ],
  exports: [
    NavComponent,
    BusquedaComponent,
    TablesComponent,
    PaginadorComponentComponent,
    FooterComponent,
    FilterPipe,
    ChartComponent
  ]
})
export class SharedModule { }
