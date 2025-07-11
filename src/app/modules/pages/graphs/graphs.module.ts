import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PakagesComponent } from './pakages/pakages.component';
import { GraphsRoutingModule } from './graphs-routing.module';
import { RHGraphsComponent } from './rhgraphs/rhgraphs.component';



@NgModule({
  declarations: [
    PakagesComponent,
    RHGraphsComponent
  ],
  imports: [
    CommonModule,
    GraphsRoutingModule
  ]
})
export class GraphsModule { }
