import { Component, EventEmitter, OnInit, Input, OnChanges } from '@angular/core';
import { toast } from 'angular2-materialize';
import { MaterializeAction } from 'angular2-materialize';

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
  libraryModal = new EventEmitter<string|MaterializeAction>();

  constructor() {}

  ngOnInit() {
    this.player.hand = [];
    this.player.graveyard = [];
    this.player.exile = [];

    if (this.player.username === this.currentUsername) {
      this.isCurrentUser = true;

      window.addEventListener(('keydown'), (e) => {
        // search through library
        if (e.key === 's') {
          const hoveredElements = document.querySelectorAll(':hover');
          const hoveredElement = hoveredElements[hoveredElements.length - 1];

          if (hoveredElement.classList.contains('library')) {
            if (hoveredElement.parentElement.parentElement.id === this.currentUsername) {
              this.libraryModal.emit({action: 'modal', params: ['open']});
            } else {
              toast('You can only search through your own library', 5000);
            }
          }
        }
      });
    }
  }

  closeLibraryModal() {
    this.libraryModal.emit({action: 'modal', params: ['close']});
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
}
