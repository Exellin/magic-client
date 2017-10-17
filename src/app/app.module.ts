import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { HttpModule } from '@angular/http';
import { MaterializeModule } from 'angular2-materialize';

import { AppComponent } from './app.component';
import { BoardComponent } from './board/board.component';
import { RoutingModule } from './routing.module';
import { AuthModule } from './auth/auth.module';
import { ProfileModule } from './profile/profile.module';
import { HomeComponent } from './home/home.component';
import { NavbarModule } from './navbar/navbar.module';
import { PlayerAreaComponent } from './board/player-area/player-area.component';
import { BattlefieldComponent } from './board/battlefield/battlefield.component';

@NgModule({
  declarations: [
    AppComponent,
    BoardComponent,
    HomeComponent,
    PlayerAreaComponent,
    BattlefieldComponent
  ],
  imports: [
    AuthModule,
    BrowserModule,
    BrowserAnimationsModule,
    HttpModule,
    RoutingModule,
    MaterializeModule,
    ProfileModule,
    NavbarModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})

export class AppModule {}
