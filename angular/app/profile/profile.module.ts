import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ProfileComponent } from './profile.component';
import { ProfileService } from './profile.service';
import { DecksListComponent } from '../decks//decks-list/decks-list.component';

@NgModule({
  declarations: [
    ProfileComponent,
    DecksListComponent
  ],
  imports: [
    CommonModule
  ],
  providers: [
    ProfileService
  ]
})

export class ProfileModule {}
