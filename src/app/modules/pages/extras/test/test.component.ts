import { Component } from '@angular/core';


@Component({
    selector: 'app-test',
    templateUrl: './test.component.html',
    styleUrls: ['./test.component.css'],
    standalone: false
})
export class TestComponent {
  constructor(

  ) {

  }
  pieLabels = ['Rojo', 'Azul', 'Amarillo'];
  pieData = [10, 20, 30];

  barLabels = ['Enero', 'Febrero', 'Marzo'];
  barData = [150, 200, 175];

  lineLabels = ['Lunes', 'Martes', 'Miércoles'];
  lineData = [5, 15, 10];
}
