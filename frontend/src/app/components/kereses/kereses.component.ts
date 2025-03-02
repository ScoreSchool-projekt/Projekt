import { Component } from '@angular/core';
import { AdatokService } from '../../services/adatok.service';
import { BejelentkezesService } from '../../services/bejelentkezes.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-kereses',
  standalone: false,
  templateUrl: './kereses.component.html',
  styleUrls: ['./kereses.component.css']
})
export class KeresesComponent {
  profil: any[] = [];
  csapat: any[] = [];
  torna: any[] = [];
  jatekos: any[] = [];
  meccs: any[] = [];
  csoport: any[] = [];

  kategoriak: any[] = ['torna', 'csapat', 'jatekos'];
  kivalasztottkategoria: string = '';
  keresett: string = '';
  eredmenyek: any[] = [];

  constructor(private adatokService: AdatokService, private bejelentkezesService:BejelentkezesService, private router: Router) { }

  ngOnInit() {
    this.tombokfeltoltese();
  }

  kijelentkezes() {
    this.bejelentkezesService.kijelentkezes();
    console.log("Felhasználó kijelentkezett.");
    this.router.navigate([""]);
  }

  tombokfeltoltese() {
    this.adatokService.GETmindentabla().subscribe({
      next: (data) => {
        [this.profil, this.csapat, this.torna, this.jatekos, this.meccs, this.csoport] = data;
        console.log('Összes adat betöltve:', data);
        this.eredmenyek = this.meccs.map(meccs => ({
          ...meccs,
          csapat1_nev: this.csapat.find(cs => cs.id === meccs.csapat1)?.csapatneve || 'Ismeretlen',
          csapat2_nev: this.csapat.find(cs => cs.id === meccs.csapat2)?.csapatneve || 'Ismeretlen'
        }));
      },
      error: (err) => console.error('Hiba történt az adatok lekérése közben:', err)
    });
  }

  kiiras() {
    switch (this.kivalasztottkategoria) {
      case 'torna':
        this.eredmenyek = this.torna;
        break;
      case 'csapat':
        this.eredmenyek = this.csapat;
        break;
      case 'jatekos':
        this.eredmenyek = this.jatekos.filter(j => j.nev.toLowerCase().includes(this.keresett.toLowerCase()));
        this.eredmenyek.forEach(jatekos => {
          const csapat = this.csapat.find(c => c.id === jatekos.csapatid);
          jatekos.csapatnev = csapat ? csapat.csapatneve : 'Ismeretlen csapat';
        });
        break;
      default:
        this.eredmenyek = this.meccs;
        break;
    }
  }

  jatekosai = [];
  meccsei = [];
  Kereses() {
    if (!this.kivalasztottkategoria || !this.keresett) {
      this.eredmenyek = this.meccs;
    }
    switch (this.kivalasztottkategoria) {
      case 'torna':
        this.eredmenyek = this.torna.filter(t =>
          t.tornaneve.toLowerCase().includes(this.keresett.toLowerCase())
        );
        this.eredmenyek.forEach(torna => {
          // Meccsek hozzárendelése az adott tornához
          torna.meccsei = this.meccs
            .filter(meccs => meccs.tornaid === torna.id)
            .map(meccs => ({
              ...meccs,
              csapat1_nev: this.csapat.find(cs => cs.id === meccs.csapat1)?.csapatneve || 'Ismeretlen',
              csapat2_nev: this.csapat.find(cs => cs.id === meccs.csapat2)?.csapatneve || 'Ismeretlen'
            }));
        });
        break;

      case 'csapat':
        this.eredmenyek = this.csapat.filter(c =>
          c.csapatneve.toLowerCase().includes(this.keresett.toLowerCase())
        );
        this.eredmenyek.forEach(csapat => {
          csapat.jatekosai = this.jatekos.filter(j => j.csapatid === csapat.id);
          csapat.meccsei = this.meccs
            .filter(meccs => meccs.csapat1 === csapat.id || meccs.csapat2 === csapat.id)
            .map(meccs => ({
              ...meccs,
              csapat1_nev: this.csapat.find(cs => cs.id === meccs.csapat1)?.csapatneve || 'Ismeretlen',
              csapat2_nev: this.csapat.find(cs => cs.id === meccs.csapat2)?.csapatneve || 'Ismeretlen'
            }));
        });
        break;

      case 'jatekos':
        this.eredmenyek = this.jatekos.filter(j => j.nev.toLowerCase().includes(this.keresett.toLowerCase()));
        this.eredmenyek.forEach(jatekos => {
          const csapat = this.csapat.find(c => c.id === jatekos.csapatid);
          jatekos.csapatnev = csapat ? csapat.csapatneve : 'Ismeretlen csapat';
        });
        break;
      default:
        this.eredmenyek = this.meccs;
        break;
    }
    console.log('Szűrt eredmények:', this.eredmenyek);
  }

  isMenuOpen = false; // Kezdetben a menü zárva van

  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
  }
}