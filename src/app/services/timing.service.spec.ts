import { inject, TestBed } from '@angular/core/testing';

import { TimingService } from './timing.service';

describe('TimingService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', inject([TimingService], (service: TimingService) => {
    expect(service).toBeTruthy();
  }));
});
