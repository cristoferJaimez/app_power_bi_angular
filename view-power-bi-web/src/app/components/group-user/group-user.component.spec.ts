import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GroupUserComponent } from './group-user.component';

describe('GroupUserComponent', () => {
  let component: GroupUserComponent;
  let fixture: ComponentFixture<GroupUserComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [GroupUserComponent]
    });
    fixture = TestBed.createComponent(GroupUserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
