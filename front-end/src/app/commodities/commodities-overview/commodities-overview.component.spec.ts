import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CommoditiesOverviewComponent } from './commodities-overview.component';

describe('CommoditiesOverviewComponent', () => {
  let component: CommoditiesOverviewComponent;
  let fixture: ComponentFixture<CommoditiesOverviewComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CommoditiesOverviewComponent]
    });
    fixture = TestBed.createComponent(CommoditiesOverviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
