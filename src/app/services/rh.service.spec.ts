import { TestBed } from '@angular/core/testing';

import { RHService } from './rh.service';

describe('RHService', () => {
  let service: RHService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RHService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
