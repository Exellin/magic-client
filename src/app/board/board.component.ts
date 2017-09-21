import { Component, OnInit } from '@angular/core';

import { CardsService } from '../cards/cards.service';
import { environment } from '../../environments/environment';

declare const Pusher;

@Component({
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.scss']
})

export class BoardComponent implements OnInit {
  pusherChannel;
  gameId;
  cardNames = [['nissa, worldwaker'], ['lightning bolt']];
  deck = [];

  constructor(private cardsService: CardsService) {}

  ngOnInit() {
    for (const cardName of this.cardNames) {
      this.cardsService.getCardFromApi(cardName).subscribe(
        res => {
          this.deck.push(res.cards[0]);
        },
        err => {
          console.log(err);
        }
      );
    }
    this.initPusher();
  }

  initPusher() {
    this.gameId = this.findOrCreateId();
    const pusher = new Pusher(environment.appKey, {
      authEndpoint: 'http://localhost:3000/api/pusher/auth',
      auth: {
        headers: {
          'Authorization': localStorage.getItem('token')
        }
      },
      cluster: environment.appCluster
    });
    this.pusherChannel = pusher.subscribe(this.gameId);
  }

  findOrCreateId() {
    const match = RegExp('[?]' + 'id' + '=([^]*)').exec(location.search);
    let id = match && decodeURIComponent(match[1].replace(/\+/g, ' '));
    if (!id) {
      id = 'presence-' + Math.random().toString(36).substr(2, 8);
      location.search = `id=${id}`;
    }
    return id;
  }
}
