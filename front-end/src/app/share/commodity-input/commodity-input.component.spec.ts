import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CommodityInputComponent } from './commodity-input.component';

describe('CommodityInputComponent', () => {
  let component: CommodityInputComponent;
  let fixture: ComponentFixture<CommodityInputComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CommodityInputComponent]
    });
    fixture = TestBed.createComponent(CommodityInputComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
