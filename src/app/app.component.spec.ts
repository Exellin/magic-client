import { TestBed, async } from '@angular/core/testing';
import { MaterializeModule } from 'angular2-materialize';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';

import { AppComponent } from './app.component';
import { AuthModule } from './auth/auth.module';
import { BattlefieldComponent } from './board/battlefield/battlefield.component';
import { BoardComponent } from './board/board.component';
import { HomeComponent } from './home/home.component';
import { NavbarModule } from './navbar/navbar.module';
import { PlayerAreaComponent } from './board/player-area/player-area.component';
import { ProfileModule } from './profile/profile.module';

describe('AppComponent', () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        AppComponent,
        BattlefieldComponent,
        BoardComponent,
        HomeComponent,
        PlayerAreaComponent,
      ],
      imports: [
        AuthModule,
        MaterializeModule,
        NavbarModule,
        ProfileModule,
        ReactiveFormsModule,
        RouterTestingModule
      ]
    }).compileComponents();
  }));

  it('should create the app', async(() => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.debugElement.componentInstance;
    expect(app).toBeTruthy();
  }));
});
