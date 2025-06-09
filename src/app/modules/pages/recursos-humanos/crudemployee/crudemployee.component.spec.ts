import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CRUDEmployeeComponent } from './crudemployee.component';

describe('CRUDEmployeeComponent', () => {
  let component: CRUDEmployeeComponent;
  let fixture: ComponentFixture<CRUDEmployeeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CRUDEmployeeComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CRUDEmployeeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
