import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { HttpModule } from '@angular/http';
import { HttpClientModule } from '@angular/common/http';
import { MaterializeModule } from 'angular2-materialize';

import { AppComponent } from './app.component';
import { AuthModule } from './auth/auth.module';
import { BattlefieldComponent } from './board/battlefield/battlefield.component';
import { BoardComponent } from './board/board.component';
import { FormsModule } from '@angular/forms';
import { HomeComponent } from './home/home.component';
import { NavbarModule } from './navbar/navbar.module';
import { ProfileModule } from './profile/profile.module';
import { RoutingModule } from './routing.module';

@NgModule({
  declarations: [
    AppComponent,
    BattlefieldComponent,
    BoardComponent,
    HomeComponent
  ],
  imports: [
    AuthModule,
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    HttpModule,
    HttpClientModule,
    RoutingModule,
    MaterializeModule,
    ProfileModule,
    NavbarModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})

export class AppModule {}
