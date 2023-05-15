import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GeographyLeftPanelComponent } from './geography-left-panel.component';

describe('GeographyLeftPanelComponent', () => {
  let component: GeographyLeftPanelComponent;
  let fixture: ComponentFixture<GeographyLeftPanelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GeographyLeftPanelComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GeographyLeftPanelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
