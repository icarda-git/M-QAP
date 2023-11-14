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
      'linear-gradient(to right, #0F212F, #0E1E2B)';
    this.headerService.backgroundNavMain =
      'linear-gradient(to right, #436280, #30455B)';
    this.headerService.backgroundUserNavButton =
      'linear-gradient(to right, #436280, #30455B)';
    this.headerService.backgroundFooter =
      'linear-gradient(to right, #0F212F, #0E1E2B)';
  }

  ngOnInit() {
    this.title.setTitle('Training cycle');
    this.meta.updateTag({ name: 'description', content: 'Training cycle' });
  }
}
