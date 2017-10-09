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

  constructor() {}

  ngOnInit() {
    this.player.library = [];
    this.player.hand = [];
    this.listenForChanges();

    if (this.player.username === this.currentUsername) {
      this.createLibrary(this.player.deck);
      this.shuffleLibrary(this.player.library);
    }
  }

  listenForChanges() {
    this.pusherChannel.bind('client-draw-card', obj => {
      this.player.hand.push(this.player.library.shift());
    });

    this.pusherChannel.bind('client-shuffle-library', obj => {
      const library = [];

      for (const id of obj.IdArray) {
        const match = this.player.deck.cards.find((card) => {
          return id === card.multiverseid;
        });
        library.push(match);
      }
      this.player.library = library;
    });
  }

  createLibrary(deck) {
    for (const card of deck.cards) {
      for (let i = 0; i < card.quantity; i++) {
        this.player.library.push(card);
      }
    }
  }

  convertLibraryToArrayOfIds(library) {
    const IdArray = [];
    for (const card of library) {
      IdArray.push(card.multiverseid);
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
      IdArray: IdArray
    });
  }

  drawCard() {
    if (this.player.library.length !== 0) {
      this.player.hand.push(this.player.library.shift());
      this.pusherChannel.trigger('client-draw-card', {});
    } else {
      toast('library is empty', 5000);
    }
  }
}
