import { TestBed } from '@angular/core/testing';

import { SwalNotificationService } from './swal-notification.service';

describe('SwalNotificationService', () => {
  let service: SwalNotificationService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SwalNotificationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
