import { Component } from '@angular/core';
import { HeaderServiceService } from '../../header-service.service';

@Component({
  selector: 'app-commodities-page',
  templateUrl: './commodities-page.component.html',
  styleUrls: ['./commodities-page.component.scss'],
})
export class CommoditiesPageComponent {
  constructor(public headerService: HeaderServiceService) {}

  ngOnInit() {
    this.headerService
      .setBackground('linear-gradient(to right, #04030F, #04030F)')
      .setBackgroundNavMain('linear-gradient(to right, #2A2E45, #212537)')
      .setBackgroundUserNavButton('linear-gradient(to right, #2A2E45, #212537)')
      .setBackgroundFooter('linear-gradient(to top right, #2A2E45, #212537)')
      .setBackgroundDeleteYes('#5569dd')
      .setBackgroundDeleteClose('#808080')
      .setBackgroundDeleteLr('#5569dd')
      .setTitle('Commodities')
      .setDescription('Commodities');
  }
}
