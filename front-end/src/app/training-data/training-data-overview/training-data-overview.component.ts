import { Component } from '@angular/core';
import { HeaderServiceService } from 'src/app/header-service.service';

@Component({
  selector: 'app-training-data-overview',
  templateUrl: './training-data-overview.component.html',
  styleUrls: ['./training-data-overview.component.scss'],
})
export class TrainingDataOverviewComponent {
  constructor(public headerService: HeaderServiceService) {
    this.headerService.background =
      'linear-gradient(to right, #04030F, #04030F)';
    this.headerService.backgroundNavMain =
      'linear-gradient(to right, #2A2E45, #212537)';
    this.headerService.backgroundUserNavButton =
      'linear-gradient(to right, #2A2E45, #212537)';

    this.headerService.backgroundFooter =
      'linear-gradient(to top right, #2A2E45, #212537)';
    this.headerService.backgroundDeleteYes = '#5569dd';
    this.headerService.backgroundDeleteClose = '#808080';
    this.headerService.backgroundDeleteLr = '#5569dd';
  }
}
