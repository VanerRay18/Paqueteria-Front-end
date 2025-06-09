import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CheckAssistanceComponent } from './check-assistance.component';

describe('CheckAssistanceComponent', () => {
  let component: CheckAssistanceComponent;
  let fixture: ComponentFixture<CheckAssistanceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CheckAssistanceComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CheckAssistanceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
