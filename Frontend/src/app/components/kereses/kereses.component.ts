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
  // tömbök az lekért adatokhoz
  profil: any[] = [];
  csapat: any[] = [];
  torna: any[] = [];
  jatekos: any[] = [];
  meccs: any[] = [];
  csoport: any[] = [];

  // ez akereső funkicóhoz kell
  kategoriak: any[] = ['torna', 'csapat', 'jatekos']; // legördülő lista lehetőségei
  kivalasztottkategoria: string = ''; // ez tárolja a kiválasztott kategóriát
  keresett: string = ''; // a keresőmezőbe beírt szöveg
  eredmenyek: any[] = []; // eredméynek

  constructor(private adatokService: AdatokService, private bejelentkezesService:BejelentkezesService, private router: Router) { }

  ngOnInit() {
    this.tombokfeltoltese();
  }

  // ez a kijelentkezeés funkciót hívja meg a bejelentkezes service-ből
  kijelentkezes() {
    this.bejelentkezesService.kijelentkezes();
    console.log("Felhasználó kijelentkezett.");
    this.router.navigate([""]); // visszadobja a főoldalra
  }

  // ez fogja lekérni az adatokat, eltárolni a megfelelő tömbbe, és megadja, hogy az eredmények először
  // a meccseket tárolja, ezek fognak megjelenni először ha megnyitjuk az oldalt. A csapat neveket a
  // csapat táblából fogja kiolvasni
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

  //ha már kiválasztott egy kategóriát a felhasználó, akkor alapból megjeleníti a hozzá
  //tartozó összes adatot, a játékos esetén a csapat tömbből olvassa ki a csapat nevét
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

  // a kereső mezőbe írt adatot megkeressük abban a tömbben, amit kategóriaként megadott a felhasználó
  // és megkeresi azt az adott tornát/csapatot/játékost a tömbből
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

  // Ez a nav-bárhoz van, a hamburger menü működése
  isMenuOpen = false; // Kezdetben a menü zárva van

  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
  }
}