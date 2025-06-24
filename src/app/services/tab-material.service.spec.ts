import { TestBed } from '@angular/core/testing';

import { TabMaterialService } from './tab-material.service';

describe('TabMaterialService', () => {
  let service: TabMaterialService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TabMaterialService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
