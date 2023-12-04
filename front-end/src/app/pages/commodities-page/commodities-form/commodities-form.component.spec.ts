import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CommoditiesFormComponent } from './commodities-form.component';

describe('CommoditiesFormComponent', () => {
  let component: CommoditiesFormComponent;
  let fixture: ComponentFixture<CommoditiesFormComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CommoditiesFormComponent]
    });
    fixture = TestBed.createComponent(CommoditiesFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
