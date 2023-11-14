import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SearchTrainingCycleComponent } from './search-training-cycle.component';

describe('SearchTrainingCycleComponent', () => {
  let component: SearchTrainingCycleComponent;
  let fixture: ComponentFixture<SearchTrainingCycleComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SearchTrainingCycleComponent]
    });
    fixture = TestBed.createComponent(SearchTrainingCycleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
