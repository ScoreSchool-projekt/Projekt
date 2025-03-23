import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StatisztikaComponent } from './statisztika.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { AdatokService } from '../../services/adatok.service';

describe('StatisztikaComponent', () => {
  let component: StatisztikaComponent;
  let fixture: ComponentFixture<StatisztikaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, StatisztikaComponent],
      providers: [AdatokService]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StatisztikaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
