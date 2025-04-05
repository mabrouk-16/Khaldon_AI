import { Component, Input, input } from '@angular/core';
import { Chart } from 'chart.js/auto';

@Component({
  selector: 'app-line-chart',
  standalone: true,
  imports: [],
  templateUrl: './line-chart.component.html',
  styleUrl: './line-chart.component.scss',
})
export class LineChartComponent {
  public chart: any;
  @Input() areas: any[] = [];
  @Input() areaName: string = '';
  // areas = input.required<any[]>();
  labels: string[] = [];
  data: number[] = [];
  predictPrice: number[] = [];
  actualPrice: number[] = [];
  ngOnInit() {
    this.createChart();
  }

  ngOnChanges(): void {
    this.areas.forEach((element) => {
      this.labels.push(element.history);
      this.predictPrice.push(element['predict price']);
      this.actualPrice.push(element['actual price']);
    });
    console.log(this.data);
  }
  createChart() {
    let delayed: any;
    this.chart = new Chart('PolarChart', {
      type: 'line',
      data: {
        labels: this.labels, // X-axis labels
        datasets: [
          {
            label: 'Predicted Price',
            // Name of the first dataset
            data: this.predictPrice, // Values for each corresponding label
            borderColor: 'rgba(23, 92, 252, 0.86)',
            backgroundColor: [
              'rgba(51, 64, 240, 0.53)',
              // 'rgba(8, 71, 154, 0.58)',
              // 'rgba(154, 8, 8, 0.58)',
              // 'rgba(154, 142, 8, 0.58)',
              // 'rgba(154, 8, 139, 0.58)',
            ], // Color of the bars
          },
          {
            label: 'Actual Price',
            // Name of the first dataset
            data: this.actualPrice, // Values for each corresponding label
            borderColor: 'rgba(235, 79, 31, 0.9)',
            backgroundColor: [
              'rgba(240, 35, 35, 0.59)',
              // 'rgb(8, 154, 57)',
              // 'rgba(224, 13, 13, 0.58)',
              // 'rgba(154, 142, 8, 0.58)',
              // 'rgba(154, 8, 139, 0.58)',
            ], // Color of the bars
          },
        ],
      },
      options: {
        scales: {},
        plugins: {
          legend: {
            display: false,
          },
          title: {
            display: true,
            text: this.areaName,
          },
        },
        responsive: true,
        animation: {
          onComplete: () => {
            delayed = true;
          },
          delay: (context: any) => {
            let delay = 0;
            if (
              context.type === 'data' &&
              context.mode === 'default' &&
              !delayed
            ) {
              delay = context.dataIndex * 50 + context.datasetIndex * 50;
            }
            return delay;
          },
        },
      },
    });
  }
}
