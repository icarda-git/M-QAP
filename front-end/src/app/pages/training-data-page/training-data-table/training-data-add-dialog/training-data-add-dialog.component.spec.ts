import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TrainingDataAddDialogComponent } from './training-data-add-dialog.component';

describe('TrainingDataAddDialogComponent', () => {
  let component: TrainingDataAddDialogComponent;
  let fixture: ComponentFixture<TrainingDataAddDialogComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TrainingDataAddDialogComponent]
    });
    fixture = TestBed.createComponent(TrainingDataAddDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
