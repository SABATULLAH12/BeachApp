import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DataAvailabilityComponent } from './data-availability.component';

describe('DataAvailabilityComponent', () => {
  let component: DataAvailabilityComponent;
  let fixture: ComponentFixture<DataAvailabilityComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DataAvailabilityComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DataAvailabilityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
