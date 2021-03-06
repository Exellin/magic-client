import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { NgxErrorsModule } from '@ultimate/ngxerrors';
import { RoutingModule } from '../routing.module';

import { ProfileComponent } from './profile.component';
import { ProfileService } from './profile.service';
import { CardsService } from '../cards/cards.service';
import { DecksListComponent } from '../decks/decks-list/decks-list.component';
import { DeckComponent } from '../decks/deck/deck.component';
import { DeckService } from '../decks/deck.service';
import { NavbarModule } from '../navbar/navbar.module';

@NgModule({
  declarations: [
    ProfileComponent,
    DeckComponent,
    DecksListComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RoutingModule,
    NgxErrorsModule,
    NavbarModule
  ],
  providers: [
    CardsService,
    DeckService,
    ProfileService
  ]
})

export class ProfileModule {}
