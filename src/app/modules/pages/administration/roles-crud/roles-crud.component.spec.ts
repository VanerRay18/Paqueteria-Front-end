import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RolesCRUDComponent } from './roles-crud.component';

describe('RolesCRUDComponent', () => {
  let component: RolesCRUDComponent;
  let fixture: ComponentFixture<RolesCRUDComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RolesCRUDComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RolesCRUDComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
