import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TrainingCycleOverviewComponent } from './training-cycle-overview.component';

describe('TrainingCycleOverviewComponent', () => {
  let component: TrainingCycleOverviewComponent;
  let fixture: ComponentFixture<TrainingCycleOverviewComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TrainingCycleOverviewComponent]
    });
    fixture = TestBed.createComponent(TrainingCycleOverviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
