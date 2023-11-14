import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TrainingCycleAddDialogComponent } from './training-cycle-add-dialog.component';

describe('TrainingCycleAddDialogComponent', () => {
  let component: TrainingCycleAddDialogComponent;
  let fixture: ComponentFixture<TrainingCycleAddDialogComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TrainingCycleAddDialogComponent]
    });
    fixture = TestBed.createComponent(TrainingCycleAddDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
