import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PackageTrackingCarComponent } from './package-tracking-car.component';

describe('PackageTrackingCarComponent', () => {
  let component: PackageTrackingCarComponent;
  let fixture: ComponentFixture<PackageTrackingCarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PackageTrackingCarComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PackageTrackingCarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
