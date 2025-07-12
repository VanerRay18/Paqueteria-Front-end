import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PakagesComponent } from './pakages.component';

describe('PakagesComponent', () => {
  let component: PakagesComponent;
  let fixture: ComponentFixture<PakagesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PakagesComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PakagesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
