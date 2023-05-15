import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FilterLeftPanelComponent } from './filter-left-panel.component';

describe('FilterLeftPanelComponent', () => {
  let component: FilterLeftPanelComponent;
  let fixture: ComponentFixture<FilterLeftPanelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FilterLeftPanelComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FilterLeftPanelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
