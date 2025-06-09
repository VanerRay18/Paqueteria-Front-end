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

@NgModule({
  declarations: [
    NavComponent,
    FomrsComponent,
    TablesComponent,
    FilterPipe,
    BusquedaComponent,
    FooterComponent
  ],
  imports: [
    CommonModule,
    RouterModule,
    FormsModule  // Asegúrate de incluir FormsModule aquí
  ],
  exports: [
    NavComponent,
    BusquedaComponent,
    TablesComponent,
    FooterComponent
  ]
})
export class SharedModule { }
