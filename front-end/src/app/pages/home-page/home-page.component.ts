import { Component } from '@angular/core';
import { HeaderServiceService } from '../../header-service.service';
import { Chart } from 'angular-highcharts';
import {
  Statistics,
  StatisticsService,
} from 'src/app/services/statistics.service';

@Component({
  selector: 'app-home-page',
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.scss'],
})
export class HomePageComponent {
  averageChart!: Chart;
  countChart!: Chart;
  statistics!: Statistics;
  constructor(
    public headerService: HeaderServiceService,
    private statisticsService: StatisticsService
  ) {}

  ngOnInit() {
    this.headerService
      .setBackground('linear-gradient(to right, #04030F, #04030F)')
      .setBackgroundNavMain('linear-gradient(to right, #2A2E45, #212537)')
      .setBackgroundUserNavButton('linear-gradient(to right, #2A2E45, #212537)')
      .setBackgroundFooter('linear-gradient(to top right, #2A2E45, #212537)')
      .setBackgroundDeleteYes('#5569dd')
      .setBackgroundDeleteClose('#808080')
      .setBackgroundDeleteLr('#5569dd')
      .setTitle('Home')
      .setDescription('Home');

    this.statisticsService.find().subscribe((response) => {
      this.averageChart = new Chart({
        chart: {
          type: 'line',
        },
        title: {
          text: '',
        },
        credits: {
          enabled: false,
        },
        yAxis: {
          title: {
            text: 'Average',
          },
        },
        xAxis: {
          title: {
            text: 'Cycle',
          },
        },
        series: [
          {
            name: 'Cycle id',
            data: response.cyclePredictionsAverage.map(
              (i) => i.predictions_average
            ),
          } as any,
        ],
      });
      this.countChart = new Chart({
        chart: {
          type: 'line',
        },
        title: {
          text: '',
        },
        credits: {
          enabled: false,
        },
        yAxis: {
          title: {
            text: 'Average',
          },
        },
        xAxis: {
          title: {
            text: 'Cycle',
          },
        },
        series: [
          {
            name: 'Cycle id',
            data: response.chartData.map((i) => i.predictions_count),
          } as any,
        ],
      });
      this.statistics = response;
    });
  }
}
