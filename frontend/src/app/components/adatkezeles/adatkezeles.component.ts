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
  // tömbök az lekért adatokhoz
  profil: any = null;
  torna: any[] = [];
  csapat: any[] = [];
  jatekos: any[] = [];
  meccs: any[] = [];
  csoport: any[] = [];

  // nyitott elemek tárolása
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

  // lekéri a bejelentkezett felhasználó a service-t meghívva
  ngOnInit() {
    const user = this.bejelentkezesService.getUser(); // tárolja a felhasználó adatait
    if (user) {
      this.profil = user;
      this.tombokfeltoltese();
    } else {
      console.error('Nincs bejelentkezett felhasználó!');
    }
  }

  // kijelentkezteti a felhasználót és visszadobja a főoldalra
  kijelentkezes() {
    this.bejelentkezesService.kijelentkezes();
    console.log("Felhasználó kijelentkezett.");
    this.router.navigate([""]);
  }

  //feltölti a tömböket, majd szűri a tornát, hogy csak azok kerüljenek bele a tömbbe, amik
  // bejelentkezett felhasználóhoz tartoznak
  tombokfeltoltese() {
    this.adatokService.GETmindentabla().subscribe({
      next: (data) => {
        let [profilok, csapatok, tornak, jatekosok, meccsek, csoportok] = data;
        this.csapat = csapatok;
        this.jatekos = jatekosok;
        this.meccs = meccsek;
        this.csoport = csoportok;

        console.log('Összes torna az adatbázisból:', tornak);
        // Csak a bejelentkezett felhasználó tornái jelennek meg
        this.torna = tornak.filter(torna => {
          console.log(`Torna profilid: ${torna.profilid}, Bejelentkezett profil ID: ${this.profil.id}`);
          return torna.profilid === this.profil.id;
        });

        console.log('Szűrt tornák:', this.torna);
      },
      error: (err) => console.error('Hiba történt az adatok lekérése közben:', err)
    });
  }

  // Ez a lenyitást/becsukást kezeli
  // ha az egyik torna meg van nyitva, a többit bezárja
  // ha meg van nyitva a meccsek akkor minden mást bezár és fordítva
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

  // ez ellenőrzi hogy jelenleg melyik tornán belül van nyitva
  // a meccs, csapat, játékos vagy csoport
  Nyitva(elem: 'torna' | 'csapatok' | 'jatekosok' | 'meccsek' | 'csoportok', tornaid: number): boolean {
    console.log(`Elem: ${elem}, TornaID: ${tornaid}, Nyitott:`, this.nyitottElemek[elem]);
    return this.nyitottElemek[elem] === tornaid;
  }

  // torna alapján jeleníti meg a csapatokat
  CsapatokTornaAlapjan(tornaid: number) {
    return this.csapat.filter(cs => cs.tornaid === tornaid);
  }

  // torna alapján jeleníti meg a csoportokat, és a mappel megadjuk, hogy bővítse ki a csapat nevével
  // győzelmeivel, vereségeivel és döntetleneivel a csapat tömbből
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

  // torna alapján jeleníti meg a játékosokat, és a mappel megadjuk, hogy bővítse ki a csapatnevével
  // a csapat tömbből
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

  // torna alapján jeleníti meg a meccseket, és a mappel megadjuk, hogy bővítse ki a csapatoknevével
  // a csapat tömbből
  MeccsekTornaAlapjan(tornaid: number) {
    return this.meccs.filter(m => m.tornaid === tornaid)
      .map(meccs => ({
        ...meccs,
        csapat1_nev: this.csapat.find(cs => cs.id === meccs.csapat1)?.csapatneve || 'Ismeretlen',
        csapat2_nev: this.csapat.find(cs => cs.id === meccs.csapat2)?.csapatneve || 'Ismeretlen'
      }));
  }

  // azt kezeli, hogy mikor van nyitva az új adatok feltöltésére való fül
  FormOpen: { [tornaid: number]: boolean } = {};
  UjLenyitas(tornaid: number) {
    this.FormOpen[tornaid] = !this.FormOpen[tornaid];
  }

  // az új játékos adatait lementjük és majd a service-t meghívva feltöltjük az adatbázisba,
  // a végén meghívjuk a tombfeltoltest, hogy már a módosított adatokkal együtt újra töltődjenek az adatok
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

  // az új meccs adatait lementjük és majd a service-t meghívva feltöltjük az adatbázisba,
  // a végén meghívjuk a tombfeltoltest, hogy már a módosított adatokkal együtt újra töltődjenek az adatok
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
        this.kapottmeccs = {}; 
      },
      error: (error) => {
        console.error("Meccs hozzáadás hiba:", error);
      }
    });
    this.tombokfeltoltese();
  }

  // az új csapat adatait lementjük és majd a service-t meghívva feltöltjük az adatbázisba,
  // a végén meghívjuk a tombfeltoltest, hogy már a módosított adatokkal együtt újra töltődjenek az adatok
  kapottcsapat: any = { gyozelmek: 0, veresegek: 0, dontetlenek: 0, csapatneve: '' };
  CsapatHozzaadas(tornaid: number) {
    const ujcsapat = {
      tornaid: tornaid,
      profilid: this.profil.id,
      gyozelmek: this.kapottcsapat.gyozelmek || 0, 
      veresegek: this.kapottcsapat.veresegek || 0,
      dontetlenek: this.kapottcsapat.dontetlenek || 0,
      csapatneve: this.kapottcsapat.csapatneve || '',
    };

    console.log("Küldött adat:", ujcsapat);
    this.adatokService.add('csapat', ujcsapat).subscribe({
      next: (response) => {
        alert("Csapat hozzáadva!");
        this.FormOpen[tornaid] = false;
        this.kapottcsapat = {};
      },
      error: (error) => {
        console.error("Csapat hozzáadás hiba:", error);
        alert("Nem sikerült hozzáadni a csapatot.");
      }
    });
    this.tombokfeltoltese();
  }

  // az új csoprot adatait lementjük és majd a service-t meghívva feltöltjük az adatbázisba,
  // a végén meghívjuk a tombfeltoltest, hogy már a módosított adatokkal együtt újra töltődjenek az adatok
  kapottcsoport: any = { csoportid: 0, csapat: '', kapottgolok: 0, rugottgolok: 0, pontok: 0 };
  CsoportHozzaadas(tornaid: number) {
    const ujcsoport = {
      csoportid: this.kapottcsoport.csoportid || 0,
      tornaid: tornaid,
      csapatid: this.kapottcsoport.csapat || '',
      kapottgolok: this.kapottcsoport.kapottgolok || 0,
      rugottgolok: this.kapottcsoport.rugottgolok || 0,
      golkulonbseg: (this.kapottcsoport.rugottgolok - this.kapottcsoport.kapottgolok),
      pontok: this.kapottcsoport.pontok || 0,
    };

    console.log("Küldött adat:", ujcsoport);
    this.adatokService.add('csoport', ujcsoport).subscribe({
      next: (response) => {
        alert("Csoport hozzáadva!");
        this.FormOpen[tornaid] = false;
        this.kapottcsoport = {}; 
      },
      error: (error) => {
        console.error("Csoport hozzáadás hiba:", error);
        alert("Nem sikerült hozzáadni a csoportot.");
      }
    });
    this.tombokfeltoltese();
  }

  // a megadott elem alapján törölni tudunk bármiből, a helyi tömbökből is töröljük,
  // ha esetleg nem sikerül az oldal újra töltése
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

  // csapat id-ja alapján lenyílik a módosítási fül
  modositandoCsapatId: number | null = null;
  ModositasLenyitas(csapatId: number) {
    this.modositandoCsapatId = this.modositandoCsapatId === csapatId ? null : csapatId;
  }

  // a módosított csapat adatokat lementjük és majd a service-t meghívva módosítjuk az adatbázist,
  // a végén meghívjuk a tombfeltoltest, hogy már a módosított adatokkal együtt újra töltődjenek az adatok
  modositandocsapat: any = { gyozelmek: 0, veresegek: 0, dontetlenek: 0, csapatneve: '' };
  modositascsapat(tornaid: number, csapatid: number) {
    const modositottcsapat = {
      tornaid: tornaid,
      gyozelmek: this.modositandocsapat.gyozelmek,
      veresegek: this.modositandocsapat.veresegek,
      dontetlenek: this.modositandocsapat.dontetlenek,
      csapatneve: this.modositandocsapat.csapatneve,
    };
    this.adatokService.update('csapat', this.modositandoCsapatId, modositottcsapat,).subscribe({
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

  // meccs id-ja alapján lenyílik a módosítási fül
  modositandoMeccsId = new Map<number, number | null>(); // tárolja a torna és a meccsid is
  ModositasLenyitasmeccs(tornaId: number, meccsId: number) {
    if (this.modositandoMeccsId.get(tornaId) === meccsId) {
      this.modositandoMeccsId.set(tornaId, null); // Ha már nyitva van egy, bezárja a másikat
    } else {
      this.modositandoMeccsId.set(tornaId, meccsId); // Csak ezt nyitja ki
    }
  }

  // a módosított meccs adatokat lementjük és majd a service-t meghívva módosítjuk az adatbázist,
  // a végén meghívjuk a tombfeltoltest, hogy már a módosított adatokkal együtt újra töltődjenek az adatok
  modositandomeccs: any = { cs1gol: 0, cs2gol: 0 };
  modositasmeccs(tornaid: number, id: number) {
    console.log("Mentés hívás:", id, this.modositandomeccs);
    const updatedMeccs = this.modositandomeccs;
    const meccsId = this.modositandoMeccsId;

    this.adatokService.update('meccs', id, updatedMeccs).subscribe({
      next: (response) => {
        alert("Meccs módosítva!");
        this.modositandoMeccsId = null;
        this.tombokfeltoltese(); 
      },
      error: (error) => {
        console.error('Hiba történt a meccs módosítása közben:', error);
      }
    });
    this.tombokfeltoltese();
  }

  // játékos id-ja alapján lenyílik a módosítási fül
  modositandoJatekosId: number | null = null;
  ModositasLenyitasjatekos(jatekosId: number) {
    this.modositandoJatekosId = this.modositandoJatekosId === jatekosId ? null : jatekosId;
    console.log("Aktuális módosított jatekos:", this.modositandoJatekosId);
    console.log("Módosítás hívva:", jatekosId, this.modositandojatekos)
  }

  // a módosított játkos adatokat lementjük és majd a service-t meghívva módosítjuk az adatbázist,
  // a végén meghívjuk a tombfeltoltest, hogy már a módosított adatokkal együtt újra töltődjenek az adatok
  modositandojatekos: any = { golok: 0, sargalapok: 0, piroslapok: 0 };
  modositasjatekos(jatekosid: number) {
    console.log("Módosítás hívva:", jatekosid, this.modositandojatekos)
    console.log("Mentés előtt:", this.modositandojatekos);

    const frissitettjatekos = {
      golokszama: this.modositandojatekos.golok || 0,
      sargalapok: this.modositandojatekos.sargalapok || 0,
      piroslapok: this.modositandojatekos.piroslapok || 0
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

  // csoport id-ja alapján lenyílik a módosítási fül
  modositandoCsoportId: number | null = null;
  ModositasLenyitascsoport(csoportId: number) {
    this.modositandoCsoportId = this.modositandoCsoportId === csoportId ? null : csoportId;
    console.log("Aktuális módosított csoport:", this.modositandoCsoportId);
    console.log("Módosítás hívva:", csoportId, this.modositandocsoport)
  }

  // a módosított csoport adatokat lementjük és majd a service-t meghívva módosítjuk az adatbázist,
  // a végén meghívjuk a tombfeltoltest, hogy már a módosított adatokkal együtt újra töltődjenek az adatok
  modositandocsoport: any = { kapottgolok: 0, rugottgolok: 0, pontok: 0 };
  modositascsoport(csoportid: number) {
    console.log("Módosítás hívva:", csoportid, this.modositandocsoport)
    console.log("Mentés előtt:", this.modositandocsoport);

    const frissitettCsoport = {
      kapottgolok: this.modositandocsoport.kapottgolok || 0,
      rugottgolok: this.modositandocsoport.rugottgolok || 0,
      golkulonbseg: (this.modositandocsoport.rugottgolok - this.modositandocsoport.kapottgolok),
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

  // kezeli, hogy nyitva van-e az új torna hozzáadás fül, de ha bármi mást megnyitunk, bezáródik
  // és ha mást nyitunk meg, akkor az záródik be
  tornaform: boolean = false;
  kapotttorna: any = { tornaneve: '', ev: 0, csoportokszama: 0, csapatokszama: 0, gyoztescsapat: '' };
  Form() {
    this.tornaform = !this.tornaform;
    if (this.tornaform) {
      this.nyitottElemek.csapatok = null;
      this.nyitottElemek.meccsek = null;
    }
  }

  // az új torna adatait lementjük és majd a service-t meghívva feltöltjük az adatbázisba,
  // a végén meghívjuk a tombfeltoltest, hogy már a módosított adatokkal együtt újra töltődjenek az adatok 
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

  // Ez a nav-bárhoz van, a hamburger menü működése
  isMenuOpen = false;

  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
  }

  // segít az újratöltéskor számon tartani az elemek id-ját
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