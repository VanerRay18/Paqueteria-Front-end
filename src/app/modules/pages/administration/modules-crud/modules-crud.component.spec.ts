import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModulesCRUDComponent } from './modules-crud.component';

describe('ModulesCRUDComponent', () => {
  let component: ModulesCRUDComponent;
  let fixture: ComponentFixture<ModulesCRUDComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ModulesCRUDComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ModulesCRUDComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
