import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SamplesizePopupComponent } from './samplesize-popup.component';

describe('SamplesizePopupComponent', () => {
  let component: SamplesizePopupComponent;
  let fixture: ComponentFixture<SamplesizePopupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SamplesizePopupComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SamplesizePopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
