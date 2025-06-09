import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserCRUDComponent } from './user-crud.component';

describe('UserCRUDComponent', () => {
  let component: UserCRUDComponent;
  let fixture: ComponentFixture<UserCRUDComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UserCRUDComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UserCRUDComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
