import { Component,  OnInit } from '@angular/core';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { AdatokService } from '../../services/adatok.service';
import { BejelentkezesService } from '../../services/bejelentkezes.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-statisztika',
  standalone: true,
  templateUrl: './statisztika.component.html',
  styleUrl: './statisztika.component.css',
  imports: [NgxChartsModule]
})
export class StatisztikaComponent implements OnInit {
  // ez a grafikonhoz volt, csak próbaként
  nagysag: [number, number] = [600, 400];

  // tömbök az lekért adatokhoz
  profil: any[] = [];
  csapat: any[] = [];
  torna: any[] = [];
  jatekos: any[] = [];
  meccs: any[] = [];
  csoport: any[] = [];
  donto: any[] = [];

  torna_valasztott: string = ''; //tároljuk a kiválasztott tornát
  grafikon: string = 'golkulonbseg'; // alapból a gól különbségekt mutatja betöltéskor
  csapatok: any[] = []; //a torna csapatai
  szurtadat: any[] = []; // a grafikonon megjelenített adatok

  szinek = { domain: ['#198754', '#0d6efd','#6f42c1', '#dc3545', '#ffc107', ] }; // grafikon színei

  constructor(private adatokService: AdatokService, private bejelentkezesService: BejelentkezesService,
    private router: Router
  ) { }

  // lekéri a bejelentkezett felhasználó a service-t meghívva
  ngOnInit() {
    const user = this.bejelentkezesService.getUser(); // tárolja a felhasználó adatait
    if (!user) {
      console.error('Nincs bejelentkezett felhasználó!');
      return;
    }
    
    console.log('Bejelentkezett felhasználó:', user);
    this.tombokfeltoltese(user.id); // Az ID alapján szűrjük a tornákat
  }

  // kijelentkezteti a felhasználót és visszadobja a főoldalra
  kijelentkezes() {
    this.bejelentkezesService.kijelentkezes();
    console.log("Felhasználó kijelentkezett.");
    this.router.navigate([""]);
  }


  //feltölti a tömböket, majd szűri a tornát, hogy csak azok kerüljenek bele a tömbbe, amik
  // bejelentkezett felhasználóhoz tartoznak
  tombokfeltoltese(userId: number) {
    this.adatokService.GETmindentabla().subscribe({
      next: (adat) => {
        [this.profil, this.csapat, this.torna, this.jatekos, this.meccs, this.csoport, this.donto] = adat;
        console.log('Összes adat betöltve:', adat);
  
        // Csak a bejelentkezett felhasználó tornái jelennek meg
        this.torna = this.torna.filter(t => t.profilid === userId);
  
        if (this.torna.length > 0) {
          this.torna_valasztott = this.torna[0].tornaneve; // Az első torna automatikus kiválasztása
          // elindítja az eljárást
          this.csapatokmodositasa(); 
          this.getMaxMinValue();
        }
      },
      error: (err) => console.error('Hiba történt az adatok lekérése közben:', err)
    });
  }
  
  //  a kiválasztott torna alapján megkeresi a hozzátartozó csapatokat
  // először a legelső torna csapatait menti le
  csapatokmodositasa() {
    const torna = this.torna.find(t => t.tornaneve === this.torna_valasztott);
    if (!torna) return;

    this.csapatok = this.csapat.filter(c => c.tornaid === torna.id);
    this.adatokmodositasa(); 
    this.getMaxMinValue(); // Frissítés a csapatok szűrése után
  }

  // torna kiválasztása
  Tornavalasztas(event: any) {
    this.torna_valasztott = event.target.value;
    this.csapatokmodositasa(); // meghívja az eljárást
  }
  

  // a y tengelyén lévő cím megváltoztatása
  yCim: string = "Gólkülönbség";
  Grafikonvalasztas(event: any) {
    this.grafikon = event.target.value;
    switch (this.grafikon) {
      case 'golkulonbseg':
        this.yCim = "Gólkülönbség";
        break;
      case 'rugottgolok':
        this.yCim = "Rúgott gólok";
        break;
      case 'kapottgolok':
        this.yCim = "Kapott gólok";
        break;
      case 'pontok':
        this.yCim = "Pontok";
        break;
      case 'golok':
        this.yCim = "Gólok";
        break;

    }
    // meghívja az eljárásokat
    this.csapatokmodositasa();
    this.adatokmodositasa();


  }

  csapatid: any[] = []; //tárolja torna meccseinek id-ját
  adatokmodositasa() {
    if (this.grafikon === 'golok') { // a golok lett kiválasztva kategóriaként
      this.szurtadat = this.jatekos // a szűrt adat eltárolja azokat, akik legalább egy gólt rúgtak
      .filter(j => 
        j.golokszama > 0 && 
        this.csapatid.includes(j.csapatid) 
      )
      .sort((a, b) => b.golokszama - a.golokszama)  //sorba rendezi gólok szerint és csak az első 5-öt tárolja
      .slice(0, 5) 
      .map(j => ({
        name: j.nev,
        value: j.golokszama
      }));;
    } else { //ha bármi mást választ akkor a csapatokat kapja meg a szurtadat
      this.szurtadat = this.csapatok.map(csapat => ({
        name: csapat.csapatneve,
        value: this.csoport.find(cs => cs.csapatid === csapat.id)?.[this.grafikon] || 0
      }));
      this.csapatid = this.csapatok.map(cs => cs.id);
    }
    this.getMaxMinValue();
  }
  
  // a grafikon letöltése
  letoltes() {
    const svg = document.querySelector('ngx-charts-bar-vertical svg'); //megkeresi a grafikont
    if (!svg) {
      console.error("Nem található az SVG elem!");
      return;
    }
    // blobként tároljuk (bináris fájlttároló) és megadjuk, hogy svg kiterjesztésű legyen
    const blob = new Blob([new XMLSerializer().serializeToString(svg)], { type: 'image/svg+xml' });
    // letöltési link létrehozása és letöltés elindítása
    const link = Object.assign(document.createElement('a'), {
      href: URL.createObjectURL(blob),
      download: 'grafikon.svg'
    });
    link.click();
  }

  // megszabjuk a grafikon felső és alsó értékét
  maxValue: number = 0;
  minValue: number = 0;
  getMaxMinValue() {
    // ha nincs adat akkor mind a kettő 0
    if (this.szurtadat.length === 0) {
      this.maxValue = 0;
      this.minValue = 0;
      return;
    }

    // megkeresi a szurtadat max-ját és felkerekítjük a következő 5-el osztható számra
    this.maxValue = Math.max(...this.szurtadat.map(d => d.value), 0);
    this.maxValue = Math.ceil(this.maxValue / 5) * 5;

    // megkeresi a szurtadat min-jét és ha nem 0 akkor lekerekíti a legközelebbi 5-el osztható számra
    this.minValue = Math.min(...this.szurtadat.map(d => d.value), 0);
    if (this.minValue < 0) {
      this.minValue = Math.floor(this.minValue / 5) * 5;
    }
  }

  // Ez a nav-bárhoz van, a hamburger menü működése
  isMenuOpen = false; // Kezdetben a menü zárva van

  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
  }
}