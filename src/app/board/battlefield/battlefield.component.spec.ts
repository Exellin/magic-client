import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MaterializeModule } from 'angular2-materialize';
import { RouterTestingModule } from '@angular/router/testing';

import { BattlefieldComponent } from './battlefield.component';
import { BoardComponent } from '../board.component';
import { PlayerAreaComponent } from '../player-area/player-area.component';
import { NavbarComponent } from '../../navbar/navbar.component';

describe('BattlefieldComponent', () => {
  let component: BattlefieldComponent;
  let fixture: ComponentFixture<BattlefieldComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        BattlefieldComponent,
        BoardComponent,
        PlayerAreaComponent,
        NavbarComponent
      ],
      imports: [
        MaterializeModule,
        RouterTestingModule
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BattlefieldComponent);
    component = fixture.componentInstance;
    component.players = [];
    component.battlefield = [];
    component.pusherChannel = {
      bind() {
      }
    };
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
