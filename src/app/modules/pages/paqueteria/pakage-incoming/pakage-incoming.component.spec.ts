import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PakageIncomingComponent } from './pakage-incoming.component';

describe('PakageIncomingComponent', () => {
  let component: PakageIncomingComponent;
  let fixture: ComponentFixture<PakageIncomingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PakageIncomingComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PakageIncomingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
