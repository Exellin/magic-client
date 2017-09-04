import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { ToastModule } from 'ng2-toastr/ng2-toastr';
import { HttpModule } from '@angular/http';

import { AppComponent } from './app.component';
import { BoardComponent } from './board/board.component';
import { CardsService } from './cards/cards.service';
import { NavbarComponent } from './navbar/navbar.component';
import { RoutingModule } from './routing.module';
import { AuthModule } from './auth/auth.module';

@NgModule({
  declarations: [
    AppComponent,
    BoardComponent,
    NavbarComponent,
  ],
  imports: [
    AuthModule,
    BrowserModule,
    HttpModule,
    ToastModule.forRoot(),
    RoutingModule
  ],
  providers: [
    CardsService
  ],
  bootstrap: [AppComponent]
})

export class AppModule {}
