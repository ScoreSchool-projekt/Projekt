import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { KeresesComponent } from './components/kereses/kereses.component';
import { AdatkezelesComponent } from './components/adatkezeles/adatkezeles.component';
import { StatisztikaComponent } from './components/statisztika/statisztika.component';

// ! Szükséges modulok
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { FooldalComponent } from './components/fooldal/fooldal.component';



@NgModule({
  declarations: [
    AppComponent,
    KeresesComponent,
    AdatkezelesComponent,
    FooldalComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    
    NgxChartsModule,
    FormsModule,
    CommonModule,
    HttpClientModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
