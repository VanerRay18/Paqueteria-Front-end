import { TestBed } from '@angular/core/testing';

import { PermisosUserService } from './permisos-user.service';

describe('PermisosUserService', () => {
  let service: PermisosUserService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PermisosUserService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
