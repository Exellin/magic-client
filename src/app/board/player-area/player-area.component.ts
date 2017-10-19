import { Component, OnInit, Input, OnChanges } from '@angular/core';
import { toast } from 'angular2-materialize';

@Component({
  selector: 'app-player-area',
  templateUrl: './player-area.component.html',
  styleUrls: ['./player-area.component.scss']
})

export class PlayerAreaComponent implements OnInit {
  @Input() player;
  @Input() pusherChannel;
  @Input() currentUsername;
  @Input() battlefield;
  isCurrentUser;
  cardBackUrl = 'https://mtg.gamepedia.com/media/mtg.gamepedia.com/f/f8/Magic_card_back.jpg?version=4694fa6f8c95cfc758855c8ed4c4d0c0';

  constructor() {}

  ngOnInit() {
    this.player.library = [];
    this.player.hand = [];
    this.player.graveyard = [];

    if (this.player.username === this.currentUsername) {
      this.isCurrentUser = true;
    }
  }

  createLibrary(deck) {
    let id = 0;
    for (const card of deck.cards) {
      for (let i = 0; i < card.quantity; i++) {
        const cardWithId = {
          ...card,
          libraryId: id
        };
        this.player.library.push(cardWithId);
        id++;
      }
    }
  }

  convertLibraryToArrayOfIds(library) {
    const IdArray = [];
    for (const card of library) {
      IdArray.push(card.libraryId);
    }
    return IdArray;
  }

  shuffleLibrary(library) {
    // Durstenfeld shuffle from https://en.wikipedia.org/wiki/Fisher%E2%80%93Yates_shuffle#The_modern_algorithm
    for (let i = library.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [library[i], library[j]] = [library[j], library[i]];
    }
    const IdArray = this.convertLibraryToArrayOfIds(library);
    this.pusherChannel.trigger('client-shuffle-library', {
      IdArray: IdArray,
      username: this.currentUsername
    });
  }

  drawCard() {
    if (this.player.library.length !== 0) {
      if (this.player.deck.owner.username !== this.currentUsername) {
        toast('You can only draw from your own deck', 5000);
      } else {
        this.player.hand.push(this.player.library.shift());
        this.pusherChannel.trigger('client-draw-card', {
          username: this.currentUsername
        });
      }
    } else {
      toast('library is empty', 5000);
    }
  }

  placeCardOnBattlefield(card) {
    card.width = 146;
    card.height = 204;
    card.x = 0;
    card.y = 0;
    card.deckId = this.player.deck._id;

    this.pusherChannel.trigger('client-place-card-on-battlefield', {
      username: this.currentUsername,
      card: card
    });

    this.player.hand.splice(this.player.hand.indexOf(card), 1);
    this.battlefield.push(card);
  }

  lockInDeck() {
    this.pusherChannel.trigger('client-lock-in-deck', {
      username: this.currentUsername
    });

    this.player.deckLockedIn = true;
    this.createLibrary(this.player.deck);
    this.shuffleLibrary(this.player.library);
  }
}
