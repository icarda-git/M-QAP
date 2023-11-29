import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CommoditiesComponent } from './commodities.component';

describe('CommoditiesComponent', () => {
  let component: CommoditiesComponent;
  let fixture: ComponentFixture<CommoditiesComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CommoditiesComponent]
    });
    fixture = TestBed.createComponent(CommoditiesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
