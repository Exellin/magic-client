import { Component, OnInit } from '@angular/core';

import { CardsService } from '../cards/cards.service';

@Component({
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.scss']
})

export class BoardComponent implements OnInit {
  cardNames = [['nissa, worldwaker'], ['lightning bolt']];
  deck = [];

  constructor(private cardsService: CardsService) {}

  ngOnInit() {
    for (const cardName of this.cardNames) {
      this.cardsService.getCard(cardName).subscribe(
        res => {
          for (const card of res.cards) {
            if (card.imageUrl) {
              this.deck.push(card);
              break;
            }
          }
        },
        err => {
          console.log(err);
        }
      );
    }
  }
}
