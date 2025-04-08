import { Component } from '@angular/core';
import { BejelentkezesService } from '../../services/bejelentkezes.service';
//  Ahhoz, hogy lehessen átírányítani más oldalra
import { Router } from '@angular/router';

@Component({
  selector: 'app-fooldal',
  standalone:false,
  templateUrl: './fooldal.component.html',
  styleUrls: ['./fooldal.component.css']
})
export class FooldalComponent {
  isModalVisible = false;
  isLoginMode = true; // Bejelentkezés az alapértelmezett mód
  email = '';
  jelszo = '';
  nev = '';
  errorMessage = '';
  successMessage = '';

  constructor(private authService: BejelentkezesService, private router: Router) {}

  //  Bejelentkezes fül megnyitása/bezárása
  toggleModal() {
    this.isModalVisible = !this.isModalVisible;
  }

  //  Átváltás bejelentkezésből regisztrációba
  switchMode() {
    this.isLoginMode = !this.isLoginMode;
    this.errorMessage = '';
    this.successMessage = '';
  }
 
  // Bejelentkezes a service-t meghívva
  bejelentkezes() {
    this.authService.bejelentkezes(this.email, this.jelszo).subscribe({
      next: (user) => {
        this.successMessage = 'Sikeres bejelentkezés!';
        this.errorMessage = '';
        this.toggleModal();
        this.router.navigate(['/adatkezeles']); // Átirányítás az adatkezelő oldalra
      },
      error: () => {
        this.errorMessage = 'Hibás email vagy jelszó!';
        this.successMessage = '';
      }
    });
  }

  // Regisztráció a service-t meghívva és, hogy minden mezőt meg kell hívni
  regisztracio() {
    if (!this.nev || !this.email || !this.jelszo) {
      this.errorMessage = 'Minden mezőt ki kell tölteni!';
      return;
    }

    this.authService.regisztracio(this.nev, this.email, this.jelszo).subscribe({
      next: () => {
        this.successMessage = 'Sikeres regisztráció! Most bejelentkezhet.';
        this.errorMessage = '';
        this.toggleModal();
      },
      error: () => {
        this.errorMessage = 'Hiba történt a regisztráció során!';
        this.successMessage = '';
      }
    });
  }

  //  Bejelentkezés bezárása (ha mellé kattint)
  closeModal() {
    this.isModalVisible = false;
  }

}
