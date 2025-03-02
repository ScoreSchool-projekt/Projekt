import { TestBed } from '@angular/core/testing';

import { AdatokService } from './adatok.service';

describe('AdatokService', () => {
  let service: AdatokService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AdatokService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
