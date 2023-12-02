import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TrainingDataPageComponent } from './training-data-page.component';

describe('TrainingDataPageComponent', () => {
  let component: TrainingDataPageComponent;
  let fixture: ComponentFixture<TrainingDataPageComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TrainingDataPageComponent]
    });
    fixture = TestBed.createComponent(TrainingDataPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
