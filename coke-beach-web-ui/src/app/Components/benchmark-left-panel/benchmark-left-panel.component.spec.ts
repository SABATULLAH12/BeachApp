import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BenchmarkLeftPanelComponent } from './benchmark-left-panel.component';

describe('BenchmarkLeftPanelComponent', () => {
  let component: BenchmarkLeftPanelComponent;
  let fixture: ComponentFixture<BenchmarkLeftPanelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BenchmarkLeftPanelComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BenchmarkLeftPanelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
