import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PakageTokenComponent } from './pakage-token.component';

describe('PakageTokenComponent', () => {
  let component: PakageTokenComponent;
  let fixture: ComponentFixture<PakageTokenComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PakageTokenComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PakageTokenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
