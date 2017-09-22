import { Component, OnInit, OnDestroy } from '@angular/core';
import { toast } from 'angular2-materialize';

import { CardsService } from '../cards/cards.service';
import { environment } from '../../environments/environment';

declare const Pusher;

@Component({
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.scss']
})

export class BoardComponent implements OnInit, OnDestroy {
  pusherChannel;
  gameId;
  players;
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

  ngOnDestroy() {
    this.pusherChannel.unsubscribe(this.gameId);
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

    this.pusherChannel.bind('pusher:member_added', member => {
      toast(`${member.info.username} joined the game`, 5000);
      this.players++;
    });

    this.pusherChannel.bind('pusher:subscription_succeeded', members => {
      toast('connected', 5000);
      this.players = members.count;
    });

    this.pusherChannel.bind('pusher:member_removed', member => {
      toast(`${member.info.username} left the game`, 5000);
      this.players--;
    });
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
