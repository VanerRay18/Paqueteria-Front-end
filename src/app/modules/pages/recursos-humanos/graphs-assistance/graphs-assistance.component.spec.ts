import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GraphsAssistanceComponent } from './graphs-assistance.component';

describe('GraphsAssistanceComponent', () => {
  let component: GraphsAssistanceComponent;
  let fixture: ComponentFixture<GraphsAssistanceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GraphsAssistanceComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GraphsAssistanceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
