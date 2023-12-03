import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeleteIconComponent } from './delete-icon.component';

describe('DeleteIconComponent', () => {
  let component: DeleteIconComponent;
  let fixture: ComponentFixture<DeleteIconComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DeleteIconComponent]
    });
    fixture = TestBed.createComponent(DeleteIconComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
