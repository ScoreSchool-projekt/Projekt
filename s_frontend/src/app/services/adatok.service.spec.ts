import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { AdatokService } from './adatok.service';

describe('AdatokService', () => {
  let service: AdatokService;
  let httpMock: HttpTestingController;
  const apiUrl = 'http://localhost:3000';

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [AdatokService]
    });

    service = TestBed.inject(AdatokService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('minden tabla lekerese', () => {
    service.GETmindentabla().subscribe((res) => {
      expect(res).toBeTruthy(); 
    });

    service['tablak'].forEach((tabla) => {
      const req = httpMock.expectOne(`${apiUrl}/${tabla}`);
      expect(req.request.method).toBe('GET');
      req.flush([]);
    });
  });

  it('egy tabla lekerese', () => {
    const tabla = 'csapat';

    service.GETegytabla(tabla).subscribe((res) => {
      expect(res).toBeTruthy();
    });

    const req = httpMock.expectOne(`${apiUrl}/${tabla}`);
    expect(req.request.method).toBe('GET');
    req.flush([]);
  });

  it('uj adat hozzaadasa', () => {
    const tabla = 'jatekos';
    const ujadat = { csapatid: 1, golokszama: 1, sargalapok: 1, piroslapok: 1, nev: 'Uj jatekos', pozicio: "jatekos" };

    service.add(tabla, ujadat).subscribe((res) => {
      expect(res).toBeTruthy();
    });

    const req = httpMock.expectOne(`${apiUrl}/${tabla}`);
    expect(req.request.method).toBe('POST');
    req.flush({});
  });

  it('adat torlese', () => {
    const tabla = 'meccs';
    const id = 5;

    service.delete(tabla, id).subscribe((res) => {
      expect(res).toBeTruthy();
    });

    const req = httpMock.expectOne(`${apiUrl}/${tabla}/${id}`);
    expect(req.request.method).toBe('DELETE');
    req.flush({});
  });

  it('adat modositasa', () => {
    const tabla = 'jatekos';
    const id = 10;
    const updatedData = { pozicio: "modositott" };

    service.update(tabla, id, updatedData).subscribe((res) => {
      expect(res).toBeTruthy();
    });

    const req = httpMock.expectOne(`${apiUrl}/${tabla}/${id}`);
    expect(req.request.method).toBe('PUT');
    req.flush({});
  });
});
