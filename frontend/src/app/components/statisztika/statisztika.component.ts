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
  nagysag: [number, number] = [600, 400];

  profil: any[] = [];
  csapat: any[] = [];
  torna: any[] = [];
  jatekos: any[] = [];
  meccs: any[] = [];
  csoport: any[] = [];
  donto: any[] = [];

  torna_valasztott: string = '';
  grafikon: string = 'golkulonbseg';
  csapatok: any[] = [];
  szurtadat: any[] = [];

  szinek = { domain: ['#198754', '#0d6efd','#6f42c1', '#dc3545', '#ffc107', ] };

  constructor(private adatokService: AdatokService, private bejelentkezesService: BejelentkezesService,
    private router: Router
  ) { }

  ngOnInit() {
    const user = this.bejelentkezesService.getUser();
    if (!user) {
      console.error('❌ Nincs bejelentkezett felhasználó!');
      return;
    }
    
    console.log('✅ Bejelentkezett felhasználó:', user);
    this.tombokfeltoltese(user.id); // Az ID alapján szűrjük a tornákat
  }
  kijelentkezes() {
    this.bejelentkezesService.kijelentkezes();
    console.log("Felhasználó kijelentkezett.");
    this.router.navigate([""]);
  }


  tombokfeltoltese(userId: number) {
    this.adatokService.GETmindentabla().subscribe({
      next: (adat) => {
        [this.profil, this.csapat, this.torna, this.jatekos, this.meccs, this.csoport, this.donto] = adat;
        console.log('Összes adat betöltve:', adat);
  
        // Csak a bejelentkezett felhasználó tornái jelennek meg
        this.torna = this.torna.filter(t => t.profilid === userId);
  
        if (this.torna.length > 0) {
          this.torna_valasztott = this.torna[0].tornaneve; // Az első torna automatikus kiválasztása
          this.csapatokmodositasa();
          this.getMaxMinValue();
        }
      },
      error: (err) => console.error('Hiba történt az adatok lekérése közben:', err)
    });
  }
  

  csapatokmodositasa() {
    const torna = this.torna.find(t => t.tornaneve === this.torna_valasztott);
    if (!torna) return;

    this.csapatok = this.csapat.filter(c => c.tornaid === torna.id);
    this.adatokmodositasa();
    this.getMaxMinValue(); // Frissítés a csapatok szűrése után
  }


  Tornavalasztas(event: any) {
    this.torna_valasztott = event.target.value;
    this.csapatokmodositasa();
  }
  

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
    this.csapatokmodositasa();
    this.adatokmodositasa();


  }

  szelesseg: number = 0;
  csapatid: any[] = [];
  adatokmodositasa() {
    if (this.grafikon === 'golok') {
      this.szurtadat = this.jatekos
      .filter(j => 
        j.golokszama > 0 && 
        this.csapatid.includes(j.csapatid) 
      )
      .sort((a, b) => b.golokszama - a.golokszama) 
      .slice(0, 5) 
      .map(j => ({
        name: j.nev,
        value: j.golokszama
      }));;
    } else {
      this.szurtadat = this.csapatok.map(csapat => ({
        name: csapat.csapatneve,
        value: this.csoport.find(cs => cs.csapatid === csapat.id)?.[this.grafikon] || 0
      }));
      this.csapatid = this.csapatok.map(cs => cs.id);
    }
    this.getMaxMinValue();
  }
  

  letoltes() {
    const svg = document.querySelector('ngx-charts-bar-vertical svg');
    if (!svg) {
      console.error("Nem található az SVG elem!");
      return;
    }
    const blob = new Blob([new XMLSerializer().serializeToString(svg)], { type: 'image/svg+xml' });
    const link = Object.assign(document.createElement('a'), {
      href: URL.createObjectURL(blob),
      download: 'grafikon.svg'
    });
    link.click();
  }

  maxValue: number = 0;
  minValue: number = 0;
  getMaxMinValue() {
    if (this.szurtadat.length === 0) {
      this.maxValue = 0;
      this.minValue = 0;
      return;
    }

    this.maxValue = Math.max(...this.szurtadat.map(d => d.value), 0);
    this.maxValue = Math.ceil(this.maxValue / 5) * 5;


    this.minValue = Math.min(...this.szurtadat.map(d => d.value), 0);
    if (this.minValue < 0) {
      this.minValue = Math.floor(this.minValue / 5) * 5;
    }
  }


  isMenuOpen = false; // Kezdetben a menü zárva van

  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
  }
}