import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RHGraphsComponent } from './rhgraphs.component';

describe('RHGraphsComponent', () => {
  let component: RHGraphsComponent;
  let fixture: ComponentFixture<RHGraphsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RHGraphsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RHGraphsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
