import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EndopointCRUDComponent } from './endopoint-crud.component';

describe('EndopointCRUDComponent', () => {
  let component: EndopointCRUDComponent;
  let fixture: ComponentFixture<EndopointCRUDComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EndopointCRUDComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EndopointCRUDComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
