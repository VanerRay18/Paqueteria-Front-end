import { Component, Input, OnChanges } from '@angular/core';
import { ChartConfiguration, ChartType } from 'chart.js';

@Component({
  selector: 'app-chart',
  templateUrl: './chart.component.html',
  styleUrls: ['./chart.component.css']
})
export class ChartComponent implements OnChanges {
 @Input() chartType: ChartType = 'bar'; // 'bar' | 'pie' | 'line'
  @Input() chartLabels: string[] = [];
  @Input() chartData: number[] = [];
  @Input() title: string = '';

  public chartConfig: ChartConfiguration['data'] = {
    labels: [],
    datasets: []
  };

  ngOnChanges(): void {
    this.chartConfig = {
      labels: this.chartLabels,
      datasets: [
        {
          label: this.title,
          data: this.chartData,
          backgroundColor: [
            '#42A5F5', '#66BB6A', '#FFA726', '#26C6DA', '#D4E157',
            '#EC407A', '#AB47BC', '#FF7043', '#78909C'
          ],
          borderWidth: 1
        }
      ]
    };
  }

}

// //ejmeplo de uso en HTML
// <app-chart
//   [chartType]="'pie'"
//   [chartLabels]="['Red', 'Blue', 'Yellow']"
//   [chartData]="[10, 20, 30]"
//   [title]="'Distribución de colores'">
// </app-chart>

// // ejemplo de uso en type
// this.apiService.getChartData().subscribe(response => {
//   this.chartLabels = response.labels;
//   this.chartData = response.data;
//   this.title = response.title;
// });
