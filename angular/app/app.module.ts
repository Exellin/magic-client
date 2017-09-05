import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { HttpModule } from '@angular/http';
import { MaterializeModule } from 'angular2-materialize';

import { AppComponent } from './app.component';
import { BoardComponent } from './board/board.component';
import { CardsService } from './cards/cards.service';
import { NavbarComponent } from './navbar/navbar.component';
import { RoutingModule } from './routing.module';
import { AuthModule } from './auth/auth.module';
import { ProfileComponent } from './profile/profile.component';
import { ProfileService } from './profile/profile.service';

@NgModule({
  declarations: [
    AppComponent,
    BoardComponent,
    NavbarComponent,
    ProfileComponent,
  ],
  imports: [
    AuthModule,
    BrowserModule,
    BrowserAnimationsModule,
    HttpModule,
    RoutingModule,
    MaterializeModule
  ],
  providers: [
    CardsService,
    ProfileService
  ],
  bootstrap: [AppComponent]
})

export class AppModule {}
