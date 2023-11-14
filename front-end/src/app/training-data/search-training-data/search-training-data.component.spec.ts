import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SearchTrainingDataComponent } from './search-training-data.component';

describe('SearchTrainingDataComponent', () => {
  let component: SearchTrainingDataComponent;
  let fixture: ComponentFixture<SearchTrainingDataComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SearchTrainingDataComponent]
    });
    fixture = TestBed.createComponent(SearchTrainingDataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
