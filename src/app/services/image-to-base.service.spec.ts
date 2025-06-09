import { TestBed } from '@angular/core/testing';

import { ImageToBaseService } from './image-to-base.service';

describe('ImageToBaseService', () => {
  let service: ImageToBaseService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ImageToBaseService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
