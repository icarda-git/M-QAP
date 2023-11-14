import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TrainingDataOverviewComponent } from './training-data-overview.component';

describe('TrainingDataOverviewComponent', () => {
  let component: TrainingDataOverviewComponent;
  let fixture: ComponentFixture<TrainingDataOverviewComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TrainingDataOverviewComponent]
    });
    fixture = TestBed.createComponent(TrainingDataOverviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
