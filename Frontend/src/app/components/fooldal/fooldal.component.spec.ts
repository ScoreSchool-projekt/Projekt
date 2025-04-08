import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FooldalComponent } from './fooldal.component';
import { BejelentkezesService } from '../../services/bejelentkezes.service';
import { Router } from '@angular/router';
import { of, throwError } from 'rxjs';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('FooldalComponent', () => {
  let component: FooldalComponent;
  let fixture: ComponentFixture<FooldalComponent>;
  let authService: BejelentkezesService;
  let router: Router;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [FooldalComponent],
      imports: [HttpClientTestingModule],
      providers: [BejelentkezesService, Router]
    }).compileComponents();

    fixture = TestBed.createComponent(FooldalComponent);
    component = fixture.componentInstance;
    authService = TestBed.inject(BejelentkezesService);
    router = TestBed.inject(Router);
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  describe('bejelentkezes', () => {
    beforeEach(() => {
      component.email = 'test@gmail.com';
      component.jelszo = 'jelszo';
    });

    it('sikeres bejelentkezes', () => {
      jest.spyOn(authService, 'bejelentkezes').mockReturnValue(of({ felhasznalo: 'test' }));
      jest.spyOn(router, 'navigate').mockImplementation(() => Promise.resolve(true));

      component.bejelentkezes();

      expect(authService.bejelentkezes).toHaveBeenCalledWith('test@gmail.com', 'jelszo');
      expect(component.successMessage).toBe('Sikeres bejelentkezés!');
      expect(component.errorMessage).toBe('');
      expect(router.navigate).toHaveBeenCalledWith(['/adatkezeles']);
    });

    it('sikertelen bejelentkezes', () => {
      jest.spyOn(authService, 'bejelentkezes').mockReturnValue(throwError(() => new Error('Hiba')));

      component.bejelentkezes();

      expect(authService.bejelentkezes).toHaveBeenCalledWith('test@gmail.com', 'jelszo');
      expect(component.successMessage).toBe('');
      expect(component.errorMessage).toBe('Hibás email vagy jelszó!');
    });
  });

  describe('regisztracio', () => {
    beforeEach(() => {
      component.nev = 'teszt';
      component.email = 'test@gmail.com';
      component.jelszo = 'jelszo';
    });

    it('sikeres regisztráció', () => {
      jest.spyOn(authService, 'regisztracio').mockReturnValue(of({}));

      component.regisztracio();

      expect(authService.regisztracio).toHaveBeenCalledWith('teszt', 'test@gmail.com', 'jelszo');
      expect(component.successMessage).toBe('Sikeres regisztráció! Most bejelentkezhet.');
      expect(component.errorMessage).toBe('');
    });

    it('üres mező', () => {
      component.nev = '';
      component.regisztracio();

      expect(component.errorMessage).toBe('Minden mezőt ki kell tölteni!');
    });

    it('sikertelen regisztráció', () => {
      jest.spyOn(authService, 'regisztracio').mockReturnValue(throwError(() => new Error('Hiba')));

      component.regisztracio();

      expect(authService.regisztracio).toHaveBeenCalledWith('teszt', 'test@gmail.com', 'jelszo');
      expect(component.successMessage).toBe('');
      expect(component.errorMessage).toBe('Hiba történt a regisztráció során!');
    });
  });
});
