import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClarisaTableComponent } from './clarisa-table.component';

describe('ClarisaTableComponent', () => {
  let component: ClarisaTableComponent;
  let fixture: ComponentFixture<ClarisaTableComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ClarisaTableComponent]
    });
    fixture = TestBed.createComponent(ClarisaTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
