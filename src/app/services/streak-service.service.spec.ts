import { TestBed } from '@angular/core/testing';

import { StreakServiceService } from './streak-service.service';

describe('StreakServiceService', () => {
  let service: StreakServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(StreakServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
