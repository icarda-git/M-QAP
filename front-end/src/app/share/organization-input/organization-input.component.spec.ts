import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrganizationInputComponent } from './organization-input.component';

describe('OrganizationInputComponent', () => {
  let component: OrganizationInputComponent;
  let fixture: ComponentFixture<OrganizationInputComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OrganizationInputComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OrganizationInputComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
