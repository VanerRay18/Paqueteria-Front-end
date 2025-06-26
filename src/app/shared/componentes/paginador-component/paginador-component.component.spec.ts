import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PaginadorComponentComponent } from './paginador-component.component';

describe('PaginadorComponentComponent', () => {
  let component: PaginadorComponentComponent;
  let fixture: ComponentFixture<PaginadorComponentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PaginadorComponentComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PaginadorComponentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
