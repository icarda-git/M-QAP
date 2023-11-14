import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PredictionsTableComponent } from './predictions-table.component';

describe('PredictionsTableComponent', () => {
  let component: PredictionsTableComponent;
  let fixture: ComponentFixture<PredictionsTableComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PredictionsTableComponent]
    });
    fixture = TestBed.createComponent(PredictionsTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
