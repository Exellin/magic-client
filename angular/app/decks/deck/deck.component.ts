import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { AuthService } from '../../auth/auth.service';
import { DeckService } from '../deck.service';

@Component({
  selector: 'app-deck',
  templateUrl: './deck.component.html',
  styleUrls: ['./deck.component.scss']
})

export class DeckComponent implements OnInit {
  deck;
  ownedByCurrentUser = false;
  paramsSubscription;

  constructor(
    private activatedRoute: ActivatedRoute,
    private authService: AuthService,
    private deckService: DeckService
  ) {}

  ngOnInit() {
    this.paramsSubscription = this.activatedRoute.params.subscribe(
      params => {
        this.setDeckData(params['id']);
      }
    );
  }

  setDeckData(deckId) {
    this.deckService.getDeck(deckId).subscribe(
      res => {
        this.deck = res.data;

        if (this.deck.owner._id === this.authService.currentUser.id) {
          this.ownedByCurrentUser = true;
        }
      }
    );
  }
}
