import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { DeckService } from '../deck.service';

@Component({
  selector: 'app-deck',
  templateUrl: './deck.component.html',
  styleUrls: ['./deck.component.scss']
})

export class DeckComponent implements OnInit {
  deck;
  paramsSubscription;

  constructor(
    private activatedRoute: ActivatedRoute,
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
      }
    );
  }
}
