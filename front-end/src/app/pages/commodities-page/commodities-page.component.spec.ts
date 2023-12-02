import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CommoditiesPageComponent } from './commodities-page.component';

describe('CommoditiesPageComponent', () => {
  let component: CommoditiesPageComponent;
  let fixture: ComponentFixture<CommoditiesPageComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CommoditiesPageComponent]
    });
    fixture = TestBed.createComponent(CommoditiesPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
