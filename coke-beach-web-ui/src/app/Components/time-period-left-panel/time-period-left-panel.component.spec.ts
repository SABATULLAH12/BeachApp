import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TimePeriodLeftPanelComponent } from './time-period-left-panel.component';

describe('TimePeriodLeftPanelComponent', () => {
  let component: TimePeriodLeftPanelComponent;
  let fixture: ComponentFixture<TimePeriodLeftPanelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TimePeriodLeftPanelComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TimePeriodLeftPanelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
