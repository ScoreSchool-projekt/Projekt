import { TestBed } from '@angular/core/testing';

import { BejelentkezesService } from './bejelentkezes.service';

describe('BejelentkezesService', () => {
  let service: BejelentkezesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BejelentkezesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
