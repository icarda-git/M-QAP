import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TrainingCycleComponent } from './training-cycle-page.component';

describe('TrainingCycleComponent', () => {
  let component: TrainingCycleComponent;
  let fixture: ComponentFixture<TrainingCycleComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TrainingCycleComponent]
    });
    fixture = TestBed.createComponent(TrainingCycleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
