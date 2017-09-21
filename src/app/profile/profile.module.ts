import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { NgxErrorsModule } from '@ultimate/ngxerrors';
import { RoutingModule } from '../routing.module';

import { ProfileComponent } from './profile.component';
import { ProfileService } from './profile.service';
import { DecksListComponent } from '../decks/decks-list/decks-list.component';
import { DeckComponent } from '../decks/deck/deck.component';
import { DeckService } from '../decks/deck.service';

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
    NgxErrorsModule
  ],
  providers: [
    DeckService,
    ProfileService
  ]
})

export class ProfileModule {}
