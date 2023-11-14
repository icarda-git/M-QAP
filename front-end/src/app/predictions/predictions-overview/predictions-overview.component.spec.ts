import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PredictionsOverviewComponent } from './predictions-overview.component';

describe('PredictionsOverviewComponent', () => {
  let component: PredictionsOverviewComponent;
  let fixture: ComponentFixture<PredictionsOverviewComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PredictionsOverviewComponent]
    });
    fixture = TestBed.createComponent(PredictionsOverviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
