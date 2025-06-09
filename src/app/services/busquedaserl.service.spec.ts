import { TestBed } from '@angular/core/testing';

import { BusquedaserlService } from './busquedaserl.service';

describe('BusquedaserlService', () => {
  let service: BusquedaserlService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BusquedaserlService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
