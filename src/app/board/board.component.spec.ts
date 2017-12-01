import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpModule } from '@angular/http';
import { MaterializeModule } from 'angular2-materialize';
import { RouterTestingModule } from '@angular/router/testing';

import { BattlefieldComponent } from './battlefield/battlefield.component';
import { BoardComponent } from './board.component';
import { CardsService } from '../cards/cards.service';
import { DeckService } from '../decks/deck.service';
import { PlayerAreaComponent } from './player-area/player-area.component';
import { ProfileService } from '../profile/profile.service';
import { NavbarComponent } from '../navbar/navbar.component';

describe('BoardComponent', () => {
  let component: BoardComponent;
  let fixture: ComponentFixture<BoardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        BattlefieldComponent,
        BoardComponent,
        NavbarComponent,
        PlayerAreaComponent
      ],
      imports: [
        HttpModule,
        MaterializeModule,
        RouterTestingModule
      ],
      providers: [
        CardsService,
        DeckService,
        ProfileService
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BoardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
