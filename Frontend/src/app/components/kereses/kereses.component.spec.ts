import { ComponentFixture, TestBed } from '@angular/core/testing';

import { KeresesComponent } from './kereses.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormsModule } from '@angular/forms';
import { AdatokService } from '../../services/adatok.service';

describe('KeresesComponent', () => {
  let component: KeresesComponent;
  let fixture: ComponentFixture<KeresesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [KeresesComponent],
      imports: [HttpClientTestingModule, FormsModule],
      providers: [AdatokService]
    })
    .compileComponents();

    fixture = TestBed.createComponent(KeresesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
