import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LogsAdminComponent } from './logs-admin.component';

describe('LogsAdminComponent', () => {
  let component: LogsAdminComponent;
  let fixture: ComponentFixture<LogsAdminComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LogsAdminComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LogsAdminComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
