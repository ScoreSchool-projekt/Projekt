import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AdatkezelesComponent } from './adatkezeles.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { AdatokService } from '../../services/adatok.service';
import { BejelentkezesService } from '../../services/bejelentkezes.service';
import { Router } from '@angular/router';
import { of, throwError } from 'rxjs';

describe('AdatkezelesComponent', () => {
  let component: AdatkezelesComponent;
  let fixture: ComponentFixture<AdatkezelesComponent>;
  let authService: BejelentkezesService;
  let adatokService: AdatokService;
  let router: Router;

  beforeEach(async () => {
    jest.spyOn(window, 'alert').mockImplementation(() => {});
    await TestBed.configureTestingModule({
      declarations: [AdatkezelesComponent],
      imports: [HttpClientTestingModule],
      providers: [BejelentkezesService, AdatokService, Router]
    }).compileComponents();

    fixture = TestBed.createComponent(AdatkezelesComponent);
    component = fixture.componentInstance;
    authService = TestBed.inject(BejelentkezesService);
    adatokService = TestBed.inject(AdatokService);
    router = TestBed.inject(Router);
    fixture.detectChanges();
    jest.spyOn(authService, 'getUser').mockReturnValue({ id: 1, nev: 'Teszt Elek', email:"test@gmail.com", jelszo: "jelszo"});
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('betolti a profilt', () => {
    jest.spyOn(authService, 'getUser').mockReturnValue({ id: 1, nev: 'Teszt Elek', email:"test@gmail.com", jelszo: "jelszo"});

    component.ngOnInit();

    expect(component.profil).toEqual({ id: 1, nev: 'Teszt Elek', email:"test@gmail.com", jelszo: "jelszo"});
  });

  it('uj jatekos hozzaadas', () => {
    const mockJatekos = { nev: 'Új Játékos', golokszama: 2, csapatid: 1, sargalapok:0, piroslapok:0 };

    jest.spyOn(adatokService, 'add').mockReturnValue(of({ success: true }));
    jest.spyOn(component, 'tombokfeltoltese');

    component.kapottjatekos = mockJatekos;
    component.JatekosHozzaadas(1);

    expect(adatokService.add).toHaveBeenCalledWith('jatekos', mockJatekos);
    expect(component.tombokfeltoltese).toHaveBeenCalled();
  });

  it('csapat torles', () => {
    jest.spyOn(adatokService, 'delete').mockReturnValue(of({ success: true }));
    jest.spyOn(component, 'tombokfeltoltese');

    component.torles('csapat', 1);

    expect(adatokService.delete).toHaveBeenCalledWith('csapat', 1);
    expect(component.tombokfeltoltese).toHaveBeenCalled();
  });

  it('kijelentkezes', () => {
    jest.spyOn(authService, 'kijelentkezes');
    jest.spyOn(router, 'navigate').mockImplementation(() => Promise.resolve(true));

    component.kijelentkezes();

    expect(authService.kijelentkezes).toHaveBeenCalled();
    expect(router.navigate).toHaveBeenCalledWith([""]);
  });

});
