import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, forkJoin } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AdatokService {
  private apiUrl = 'http://localhost:3000';
  private tablak = ['profil', 'csapat', 'torna', 'jatekos', 'meccs', 'csoport'];

  constructor(private http: HttpClient) { }

  GETmindentabla(): Observable<any> {
    let requests = this.tablak.map(tabla =>
      this.http.get<any[]>(`${this.apiUrl}/${tabla}`)
    );
    return forkJoin(requests); // Egyszerre indítja az összes kérést
  }

  GETegytabla(tabla: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/${tabla}`);
  }

  add(tabla: string, adatok: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/${tabla}`, adatok);
  }
  
  delete(tabla: string, id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${tabla}/${id}`);
  }

  update(tabla: string, id: number, adatok: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/${tabla}/${id}`, adatok);
  }
}