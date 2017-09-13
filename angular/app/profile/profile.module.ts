import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ProfileComponent } from './profile.component';
import { ProfileService } from './profile.service';
import { DecksListComponent } from '../decks/decks-list/decks-list.component';
import { DeckFormComponent } from '../decks/deck-form/deck-form.component';

@NgModule({
  declarations: [
    ProfileComponent,
    DecksListComponent,
    DeckFormComponent
  ],
  imports: [
    CommonModule
  ],
  providers: [
    ProfileService
  ]
})

export class ProfileModule {}
