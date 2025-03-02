import { Component, OnInit } from '@angular/core';
import { AdatokService } from '../../services/adatok.service';
import { BejelentkezesService } from '../../services/bejelentkezes.service';
import { ChangeDetectorRef } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-adatkezeles',
  standalone: false,
  templateUrl: './adatkezeles.component.html',
  styleUrl: './adatkezeles.component.css'
})

export class AdatkezelesComponent implements OnInit {
  profil: any = null;
  torna: any[] = []; 
  csapat: any[] = [];
  jatekos: any[] = [];
  meccs: any[] = [];
  csoport: any[] = [];

  nyitottElemek: { [key: string]: number | null } = {
    torna: null,
    csapatok: null,
    jatekosok: null,
    meccsek: null,
    csoportok: null
  };
  

  constructor(
    private adatokService: AdatokService,
    private bejelentkezesService: BejelentkezesService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit() {
    const user = this.bejelentkezesService.getUser();
    if (user) {
      this.profil = user;
      this.tombokfeltoltese();
    } else {
      console.error('Nincs bejelentkezett felhasználó!');
    }
  }

  kijelentkezes() {
    this.bejelentkezesService.kijelentkezes();
    console.log("Felhasználó kijelentkezett.");
    this.router.navigate([""]);
  }

  tombokfeltoltese() {
    this.adatokService.GETmindentabla().subscribe({
      next: (data) => {
        let [profilok, csapatok, tornak, jatekosok, meccsek, csoportok] = data;
        this.csapat = csapatok;
        this.jatekos = jatekosok;
        this.meccs = meccsek;
        this.csoport = csoportok;

        console.log('Összes torna az adatbázisból:', tornak);
        this.torna = tornak.filter(torna => {
          console.log(`Torna profilid: ${torna.profilid}, Bejelentkezett profil ID: ${this.profil.id}`);
          return torna.profilid === this.profil.id;
        });

        console.log('Szűrt tornák:', this.torna);
      },
      error: (err) => console.error('Hiba történt az adatok lekérése közben:', err)
    });
  }

  Lenyitas(elem: 'torna' | 'csapatok' | 'jatekosok' | 'meccsek' | 'csoportok', tornaid: number) {
     if (elem !== 'torna' && this.tornaform) {
      this.tornaform = false;
    }
    this.nyitottElemek[elem] = this.nyitottElemek[elem] === tornaid ? null : tornaid;
    if (elem === 'torna') {
      this.nyitottElemek.csapatok = null;
      this.nyitottElemek.meccsek = null;
      this.nyitottElemek.csoportok = null;
      this.nyitottElemek.jatekosok = null;
    }
    if (elem === 'meccsek') {
      this.nyitottElemek.csapatok = null;
      this.nyitottElemek.csoportok = null;
      this.nyitottElemek.jatekosok = null;
    }
    if (elem === 'csapatok') {
      this.nyitottElemek.meccsek = null;
      this.nyitottElemek.csoportok = null;
      this.nyitottElemek.jatekosok = null;
    }
    if (elem === 'csoportok') {
      this.nyitottElemek.meccsek = null;
      this.nyitottElemek.csapatok = null;
      this.nyitottElemek.jatekosok = null;
    }
    if (elem === 'jatekosok') {
      this.nyitottElemek.meccsek = null;
      this.nyitottElemek.csapatok = null;
      this.nyitottElemek.csoportok = null;
    }
  }

  Nyitva(elem: 'torna' | 'csapatok' | 'jatekosok' | 'meccsek' | 'csoportok', tornaid: number): boolean {
    console.log(`Elem: ${elem}, TornaID: ${tornaid}, Nyitott:`, this.nyitottElemek[elem]);
    return this.nyitottElemek[elem] === tornaid;
  }
  

  CsapatokTornaAlapjan(tornaid: number) {
    return this.csapat.filter(cs => cs.tornaid === tornaid);
  }
  CsoportokTornaAlapjan(tornaid: number) {
    return this.csoport.filter(csoport => csoport.tornaid === tornaid)
    .map(csoport => ({
      ...csoport,
      csapat_nev: this.csapat.find(cs => cs.id === csoport.csapatid)?.csapatneve || 'Ismeretlen',
      gyozelmek: this.csapat.find(cs => cs.id === csoport.csapatid)?.gyozelmek,
      veresegek: this.csapat.find(cs => cs.id === csoport.csapatid)?.veresegek,
      dontetlenek: this.csapat.find(cs => cs.id === csoport.csapatid)?.dontetlenek 
    }));;
  }
  JatekosTornaAlapjan(tornaid: number) {
    return this.jatekos
        .filter(jatekos => {
            const csapat = this.csapat.find(cs => cs.id === jatekos.csapatid);
            return csapat && csapat.tornaid === tornaid;
        })
        .map(jatekos => ({
            ...jatekos,
            csapat_nev: this.csapat.find(cs => cs.id === jatekos.csapatid)?.csapatneve || 'Ismeretlen'
        }));
}

  
  

  MeccsekTornaAlapjan(tornaid: number) {
    return this.meccs.filter(m => m.tornaid === tornaid)
      .map(meccs => ({
        ...meccs,
        csapat1_nev: this.csapat.find(cs => cs.id === meccs.csapat1)?.csapatneve || 'Ismeretlen',
        csapat2_nev: this.csapat.find(cs => cs.id === meccs.csapat2)?.csapatneve || 'Ismeretlen'
      }));
  }

  FormOpen: { [tornaid: number]: boolean } = {};


  UjLenyitas(tornaid: number) {
    this.FormOpen[tornaid] = !this.FormOpen[tornaid];
  }
  
  kapottjatekos: any = { nev: '', golokszama: 0, sargalapok: 0, piroslapok: 0, csapatid: null };
  JatekosHozzaadas(tornaid: number) {
    const ujjatekos = {
      nev: this.kapottjatekos.nev,
      golokszama: this.kapottjatekos.golokszama,
      sargalapok: this.kapottjatekos.sargalapok,
      piroslapok: this.kapottjatekos.piroslapok,
      csapatid: this.kapottjatekos.csapatid
    };
    console.log("Küldött adat:", ujjatekos);
    this.adatokService.add('jatekos', ujjatekos).subscribe({
      next: (response) => {
        alert("Jatekos hozzáadva!");
        this.FormOpen[tornaid] = false;
        this.kapottjatekos = {}; 
      },
      error: (error) => {
        console.error("Meccs hozzáadás hiba:", error);
      }
    });
    this.tombokfeltoltese();
  }
  

  kapottmeccs: any = { csapat1: '', csapat2: '', cs1gol: 0, cs2gol: 0, datum: '' };
  MeccsHozzaadas(tornaid: number) {
    const ujmeccs = {
      tornaid: tornaid,
      meccstipusa: 'csoport',
      csapat1: this.kapottmeccs.csapat1,
      csapat2: this.kapottmeccs.csapat2,
      cs1gol: this.kapottmeccs.cs1gol,
      cs2gol: this.kapottmeccs.cs2gol,
      datum: this.kapottmeccs.datum,
    };
  
    console.log("Küldött adat:", ujmeccs);
    this.adatokService.add('meccs', ujmeccs).subscribe({
      next: (response) => {
        alert("Meccs hozzáadva!");
        this.FormOpen[tornaid] = false;
        this.kapottmeccs = {};  // 🔹 Helyes törlés
      },
      error: (error) => {
        console.error("Meccs hozzáadás hiba:", error);
      }
    });
    this.tombokfeltoltese();
  }
  

  kapottcsapat: any = { gyozelmek: 0, veresegek: 0, dontetlenek: 0, csapatneve: '' };
  CsapatHozzaadas(tornaid: number) {
    const ujcsapat = {
      tornaid: tornaid,
      profilid: this.profil.id,
      gyozelmek: this.kapottcsapat.gyozelmek || 0,  // 🔹 Ha nincs érték, 0 legyen
      veresegek: this.kapottcsapat.veresegek || 0,
      dontetlenek: this.kapottcsapat.dontetlenek || 0,
      csapatneve: this.kapottcsapat.csapatneve || '',
    };
  
    console.log("Küldött adat:", ujcsapat);
    this.adatokService.add('csapat', ujcsapat).subscribe({
      next: (response) => {
        alert("Csapat hozzáadva!");
        this.FormOpen[tornaid] = false;
        this.kapottcsapat = {};  // 🔹 Helyes törlés
      },
      error: (error) => {
        console.error("Csapat hozzáadás hiba:", error);
        alert("Nem sikerült hozzáadni a csapatot.");
      }
    });
    this.tombokfeltoltese();
  }
  


  kapottcsoport: any = { csoportid: 0, csapat: '', kapottgolok: 0, rugottgolok: 0, pontok:0 };
  CsoportHozzaadas(tornaid: number) {
    const ujcsoport = {
      csoportid: this.kapottcsoport.csoportid || 0,  // 🔹 Ha nincs érték, 0 legyen
      tornaid: tornaid,
      csapatid: this.kapottcsoport.csapat || '',
      kapottgolok: this.kapottcsoport.kapottgolok || 0,
      rugottgolok: this.kapottcsoport.rugottgolok || 0,
      golkulonbseg:  (this.kapottcsoport.rugottgolok-this.kapottcsoport.kapottgolok),
      pontok: this.kapottcsoport.pontok || 0,
    };
  
    console.log("Küldött adat:", ujcsoport);
    this.adatokService.add('csoport', ujcsoport).subscribe({
      next: (response) => {
        alert("Csoport hozzáadva!");
        this.FormOpen[tornaid] = false;
        this.kapottcsoport = {};  // 🔹 Helyes törlés
      },
      error: (error) => {
        console.error("Csoport hozzáadás hiba:", error);
        alert("Nem sikerült hozzáadni a csoportot.");
      }
    });
    this.tombokfeltoltese();
  }
  



  torles(elem: 'torna' | 'csapatok' | 'meccsek' | 'csoportok', id: number) {
    this.adatokService.delete(elem, id).subscribe({
      next: () => {
        alert(`${elem} sikeresen törölve!`);
        switch (elem) {
          case 'torna':
            this.torna = this.torna.filter(t => t.id !== id);
            break;
          case 'csapatok':
            this.csapat = this.csapat.filter(cs => cs.id !== id);
            break;
          case 'meccsek':
            this.meccs = this.meccs.filter(m => m.id !== id);
            break;
          case 'csoportok':
            this.meccs = this.meccs.filter(m => m.id !== id);
            break;
        }
      },
      error: (err) => {
        console.error('Hiba történt a törlés közben:', err);
      }
    });
    this.tombokfeltoltese();
  }

  modositandoCsapatId: number | null = null;
  ModositasLenyitas(csapatId: number) {
    this.modositandoCsapatId = this.modositandoCsapatId === csapatId ? null : csapatId;
  }

  modositandocsapat: any = { gyozelmek: 0, veresegek: 0, dontetlenek: 0, csapatneve: '' };
  modositascsapat(tornaid: number, csapatid: number) {
    const modositottcsapat = {
      tornaid: tornaid,
      gyozelmek: this.modositandocsapat.gyozelmek,
      veresegek: this.modositandocsapat.veresegek,
      dontetlenek: this.modositandocsapat.dontetlenek,
      csapatneve: this.modositandocsapat.csapatneve,
    };
    this.adatokService.update('csapat',  this.modositandoCsapatId, modositottcsapat,).subscribe({
      next: (response) => {
        alert("Csapat módosítva!");
        this.FormOpen[tornaid] = false;
        this.modositandocsapat[tornaid] = {};
      },
      error: (error) => {
      }
    });
    this.tombokfeltoltese();
  }

  modositandoMeccsId = new Map<number, number | null>(); // Térkép tornaId → meccsId

ModositasLenyitasmeccs(tornaId: number, meccsId: number) {
  if (this.modositandoMeccsId.get(tornaId) === meccsId) {
    this.modositandoMeccsId.set(tornaId, null); // Ha már nyitva, zárja be
  } else {
    this.modositandoMeccsId.set(tornaId, meccsId); // Csak ezt nyitja ki
  }
}

  
  
  
  

  modositandomeccs: any = { cs1gol: 0, cs2gol: 0};
  modositasmeccs(tornaid: number, id:number) {
    console.log("Mentés hívás:", id, this.modositandomeccs);
    const updatedMeccs = this.modositandomeccs;
    const meccsId = this.modositandoMeccsId;
  
    // Frissítés API hívás
    this.adatokService.update('meccs', id, updatedMeccs).subscribe({
      next: (response) => {
        alert("Meccs módosítva!");
        this.modositandoMeccsId = null;
        this.tombokfeltoltese(); // Frissítjük a meccseket
      },
      error: (error) => {
        console.error('Hiba történt a meccs módosítása közben:', error);
      }
    });
    this.tombokfeltoltese();
  }

  modositandoJatekosId: number | null = null; // Egyetlen számot tárol

  ModositasLenyitasjatekos(jatekosId: number) {
    this.modositandoJatekosId = this.modositandoJatekosId === jatekosId ? null : jatekosId;
    console.log("Aktuális módosított jatekos:", this.modositandoJatekosId);
    console.log("Módosítás hívva:", jatekosId, this.modositandojatekos)
  }
  
  
  modositandojatekos: any = { golok: 0, sargalapok: 0, piroslapok:0};
  modositasjatekos(jatekosid: number) {
    console.log("Módosítás hívva:", jatekosid, this.modositandojatekos)
    console.log("Mentés előtt:", this.modositandojatekos);
    
    const frissitettjatekos = {
      golokszama: this.modositandojatekos.golok || 0,
      sargalapok: this.modositandojatekos.sargalapok || 0,
      piroslapok:  this.modositandojatekos.piroslapok || 0
    };
  
    console.log("Frissített adatok:", frissitettjatekos);
  
    this.adatokService.update('jatekos', jatekosid, frissitettjatekos).subscribe({
      next: (response) => {
        alert("Játékos módosítva!");
      },
      error: (error) => {
        console.error("Hiba történt:", error);
      }
    });
    this.tombokfeltoltese();
  }



  modositandoCsoportId: number | null = null; // Egyetlen számot tárol

  ModositasLenyitascsoport(csoportId: number) {
    this.modositandoCsoportId = this.modositandoCsoportId === csoportId ? null : csoportId;
    console.log("Aktuális módosított csoport:", this.modositandoCsoportId);
    console.log("Módosítás hívva:", csoportId, this.modositandocsoport)
  }
  
  
  modositandocsoport: any = { kapottgolok: 0, rugottgolok: 0, pontok:0};
  modositascsoport(csoportid: number) {
    console.log("Módosítás hívva:", csoportid, this.modositandocsoport)
    console.log("Mentés előtt:", this.modositandocsoport);
    
    const frissitettCsoport = {
      kapottgolok: this.modositandocsoport.kapottgolok || 0,
      rugottgolok: this.modositandocsoport.rugottgolok || 0,
      golkulonbseg:  (this.modositandocsoport.rugottgolok-this.modositandocsoport.kapottgolok),
      pontok: this.modositandocsoport.pontok || 0,
    };
  
    console.log("Frissített adatok:", frissitettCsoport);
  
    this.adatokService.update('csoport', csoportid, frissitettCsoport).subscribe({
      next: (response) => {
        alert("Csoport módosítva!");
      },
      error: (error) => {
        console.error("Hiba történt:", error);
      }
    });
    this.tombokfeltoltese();
  }
  


  tornaform: boolean = false;
  kapotttorna: any = { tornaneve: '', ev: 0, csoportokszama: 0, csapatokszama: 0, gyoztescsapat: '' };
  Form() {
    this.tornaform = !this.tornaform;
    if (this.tornaform) {
      this.nyitottElemek.csapatok = null;
      this.nyitottElemek.meccsek = null;
    }
  }
  TornaHozzaadas() {
    const ujtorna = {
      profilid: this.profil.id,
      tornaneve: this.kapotttorna.tornaneve,
      ev: this.kapotttorna.ev,
      csoportokszama: this.kapotttorna.csoportokszama,
      csapatokszama: this.kapotttorna.csapatokszama,
      gyoztescsapat: this.kapotttorna.gyoztescsapat,
    };
    this.adatokService.add('torna', ujtorna).subscribe({
      next: (response) => {
        alert("Torna hozzáadva!");
        this.tornaform = false;
        this.kapotttorna = {};
      },
      error: (error) => {
        alert("Nem sikerült hozzáadni a tornát.");
      }
    });
    this.tombokfeltoltese();
  }

  isMenuOpen = false;

  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
  }

  trackByMeccs(index: number, item: any) {
    return item.id;
  }

  trackByCsoport(index: number, item: any) {
    return item.id;
  }

  trackByJatekos(index: number, item: any) {
    return item.id;
  }
  
}