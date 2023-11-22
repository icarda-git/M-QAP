import { Component } from '@angular/core';
import { HeaderServiceService } from '../header-service.service';
import { Meta, Title } from '@angular/platform-browser';

@Component({
  selector: 'app-training-cycle',
  templateUrl: './training-cycle.component.html',
  styleUrls: ['./training-cycle.component.scss'],
})
export class TrainingCycleComponent {
  constructor(
    public headerService: HeaderServiceService,
    private title: Title,
    private meta: Meta
  ) {
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

  ngOnInit() {
    this.title.setTitle('Training cycle');
    this.meta.updateTag({ name: 'description', content: 'Training cycle' });
  }
}
