import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { ToastModule } from 'ng2-toastr/ng2-toastr';

import { AppComponent } from './app.component';
import { BoardComponent } from './board/board.component';
import { CardsService } from './cards/cards.service';

@NgModule({
  declarations: [
    AppComponent,
    BoardComponent
  ],
  imports: [
    BrowserModule,
    ToastModule.forRoot()
  ],
  providers: [
    CardsService
  ],
  bootstrap: [AppComponent]
})

export class AppModule {}
