import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { FooldalComponent } from './components/fooldal/fooldal.component';
import { KeresesComponent } from './components/kereses/kereses.component';
import { AdatkezelesComponent } from './components/adatkezeles/adatkezeles.component';
import { StatisztikaComponent } from './components/statisztika/statisztika.component';

//  útvonalak
const routes: Routes = [

  {path: "", component: FooldalComponent},
  {path: "kereses", component: KeresesComponent},
  {path: "adatkezeles", component: AdatkezelesComponent},
  {path: "statisztika", component: StatisztikaComponent}

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
