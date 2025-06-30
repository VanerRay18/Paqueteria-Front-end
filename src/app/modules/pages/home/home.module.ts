import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InicioComponent } from './inicio/inicio.component';
import { HomeRoutingModule } from './home-routing.module';
import { PaginadorComponentComponent } from 'src/app/shared/componentes/paginador-component/paginador-component.component';
import { SharedModule } from 'src/app/shared/shared.module';



@NgModule({
  declarations: [
    InicioComponent
  ],
  imports: [
    CommonModule,
    HomeRoutingModule,
    SharedModule
  ]
})
export class HomeModule { }
