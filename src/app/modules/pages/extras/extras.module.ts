import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from 'src/app/shared/shared.module';
import { TestComponent } from './test/test.component';



@NgModule({
  declarations: [TestComponent],
  imports: [
    CommonModule,
    SharedModule
  ]
})
export class ExtrasModule { }
