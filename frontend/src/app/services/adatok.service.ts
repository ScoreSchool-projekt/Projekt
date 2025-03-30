import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, forkJoin } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AdatokService {
  //  url és egy tömb, ami a táblák neveit tárolja
  private apiUrl = 'http://localhost:3000';
  private tablak = ['profil', 'csapat', 'torna', 'jatekos', 'meccs', 'csoport'];

  constructor(private http: HttpClient) { }

  // a függvény végig megy a táblák tömbön, aztán elindítja a végpont kéréseket egyszerre
  GETmindentabla(): Observable<any> {
    let requests = this.tablak.map(tabla =>
      this.http.get<any[]>(`${this.apiUrl}/${tabla}`)
    );
    return forkJoin(requests); // Egyszerre indítja az összes kérést
  }

  // ez arra van ha esetleg egy konkrét tábla adatát akarjuk lekérni
  GETegytabla(tabla: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/${tabla}`);
  }

  // hozzáadás
  add(tabla: string, adatok: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/${tabla}`, adatok);
  }
  
  // törlés
  delete(tabla: string, id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${tabla}/${id}`);
  }

  // módosítás
  update(tabla: string, id: number, adatok: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/${tabla}/${id}`, adatok);
  }
}