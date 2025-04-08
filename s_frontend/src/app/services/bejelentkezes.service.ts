import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';


@Injectable({
  providedIn: 'root'
})
export class BejelentkezesService {
  private apiUrl = 'http://localhost:3000';  
  private userSubject = new BehaviorSubject<any>(null);  // Aktív felhasználó eltárolása
  user$ = this.userSubject.asObservable();  // Elérhető más komponensek számára is

  constructor(private http: HttpClient) {}

  // Bejelentkezési kérés
  bejelentkezes(email: string, jelszo: string): Observable<any> {
    return this.http.get<any[]>(`${this.apiUrl}/profil`).pipe(
      map(profil => {
        const user = profil.find(u => u.email === email && u.jelszo === jelszo);
        if (user) {
          this.userSubject.next(user);  
          localStorage.setItem('user', JSON.stringify(user));
          return user;
        } else {
          throw new Error('Hibás bejelentkezési adatok');
        }
      })
    );
  }
  

  // regisztráció
  regisztracio(nev: string, email: string, jelszo: string): Observable<any> {
    const ujfelhasznalo = {nev, email, jelszo };
    return this.http.post(`${this.apiUrl}/profil`, ujfelhasznalo);
  }

  // Aktuális felhasználó lekérése
  getUser() {
    const storedUser = localStorage.getItem('user');
  if (storedUser) {
    return JSON.parse(storedUser);
  }
  return null;  
  }

  // Kijelentkezés
  kijelentkezes() {
    this.userSubject.next(null);
  }
}
