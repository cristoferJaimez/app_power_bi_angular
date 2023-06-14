import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalViewsComponent } from './modal-views.component';

describe('ModalViewsComponent', () => {
  let component: ModalViewsComponent;
  let fixture: ComponentFixture<ModalViewsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ModalViewsComponent]
    });
    fixture = TestBed.createComponent(ModalViewsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
