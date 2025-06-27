import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeliveryPackagesComponent } from './delivery-packages.component';

describe('DeliveryPackagesComponent', () => {
  let component: DeliveryPackagesComponent;
  let fixture: ComponentFixture<DeliveryPackagesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DeliveryPackagesComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DeliveryPackagesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
