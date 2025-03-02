import { ComponentFixture, TestBed } from '@angular/core/testing';

import { KeresesComponent } from './kereses.component';

describe('KeresesComponent', () => {
  let component: KeresesComponent;
  let fixture: ComponentFixture<KeresesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [KeresesComponent]
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
