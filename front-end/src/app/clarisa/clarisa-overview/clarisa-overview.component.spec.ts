import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClarisaOverviewComponent } from './clarisa-overview.component';

describe('ClarisaOverviewComponent', () => {
  let component: ClarisaOverviewComponent;
  let fixture: ComponentFixture<ClarisaOverviewComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ClarisaOverviewComponent]
    });
    fixture = TestBed.createComponent(ClarisaOverviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
