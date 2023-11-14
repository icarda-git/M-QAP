import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClarisaComponent } from './clarisa.component';

describe('ClarisaComponent', () => {
  let component: ClarisaComponent;
  let fixture: ComponentFixture<ClarisaComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ClarisaComponent]
    });
    fixture = TestBed.createComponent(ClarisaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
