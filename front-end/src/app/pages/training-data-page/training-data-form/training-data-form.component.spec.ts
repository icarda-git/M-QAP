import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TrainingDataFormComponent } from './training-data-form.component';

describe('TrainingDataFormComponent', () => {
  let component: TrainingDataFormComponent;
  let fixture: ComponentFixture<TrainingDataFormComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TrainingDataFormComponent]
    });
    fixture = TestBed.createComponent(TrainingDataFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
