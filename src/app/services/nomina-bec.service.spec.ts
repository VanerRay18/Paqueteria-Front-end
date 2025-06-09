import { TestBed } from '@angular/core/testing';

import { NominaBecService } from './nomina-bec.service';

describe('NominaBecService', () => {
  let service: NominaBecService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(NominaBecService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
