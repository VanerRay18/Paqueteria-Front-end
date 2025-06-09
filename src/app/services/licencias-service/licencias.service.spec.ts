import { TestBed } from '@angular/core/testing';

import { LicenciasService } from './licencias.service';

describe('LicenciasService', () => {
  let service: LicenciasService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LicenciasService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
