import { TestBed } from '@angular/core/testing';

import { BejelentkezesService } from './bejelentkezes.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('BejelentkezesService', () => {
  let service: BejelentkezesService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule]
    });
    service = TestBed.inject(BejelentkezesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
