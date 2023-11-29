import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CommoditiesTableComponent } from './commodities-table.component';

describe('CommoditiesTableComponent', () => {
  let component: CommoditiesTableComponent;
  let fixture: ComponentFixture<CommoditiesTableComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CommoditiesTableComponent]
    });
    fixture = TestBed.createComponent(CommoditiesTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
