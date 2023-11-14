import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TrainingCycleTableComponent } from './training-cycle-table.component';

describe('TrainingCycleTableComponent', () => {
  let component: TrainingCycleTableComponent;
  let fixture: ComponentFixture<TrainingCycleTableComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TrainingCycleTableComponent]
    });
    fixture = TestBed.createComponent(TrainingCycleTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
