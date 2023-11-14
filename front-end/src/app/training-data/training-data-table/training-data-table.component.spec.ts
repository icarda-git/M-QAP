import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TrainingDataTableComponent } from './training-data-table.component';

describe('TrainingDataTableComponent', () => {
  let component: TrainingDataTableComponent;
  let fixture: ComponentFixture<TrainingDataTableComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TrainingDataTableComponent]
    });
    fixture = TestBed.createComponent(TrainingDataTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
