import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ComparisonLeftPanelComponent } from './comparison-left-panel.component';

describe('ComparisonLeftPanelComponent', () => {
  let component: ComparisonLeftPanelComponent;
  let fixture: ComponentFixture<ComparisonLeftPanelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ComparisonLeftPanelComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ComparisonLeftPanelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
