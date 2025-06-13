import { TestBed } from '@angular/core/testing';

import { PakageService } from './pakage.service';

describe('PakageService', () => {
  let service: PakageService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PakageService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
