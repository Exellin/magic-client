import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpModule } from '@angular/http';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';

import { AuthService } from '../../auth/auth.service';
import { CardsService } from '../../cards/cards.service';
import { DeckService } from '../deck.service';
import { DeckComponent } from './deck.component';
import { NavbarComponent } from '../../navbar/navbar.component';

describe('DeckComponent', () => {
  let component: DeckComponent;
  let fixture: ComponentFixture<DeckComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        DeckComponent,
        NavbarComponent
      ],
      imports: [
        HttpModule,
        ReactiveFormsModule,
        RouterTestingModule
      ],
      providers: [
        AuthService,
        CardsService,
        DeckService
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DeckComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
