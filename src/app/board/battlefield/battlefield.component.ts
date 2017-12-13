import { Component, OnInit, Input } from '@angular/core';
import { toast } from 'angular2-materialize';

@Component({
  selector: 'app-battlefield',
  templateUrl: './battlefield.component.html',
  styleUrls: ['./battlefield.component.scss']
})

export class BattlefieldComponent implements OnInit {
  @Input() battlefield;
  @Input() pusherChannel;
  @Input() currentUsername;
  @Input() players;
  oldMouseX;
  oldMouseY;
  currentMouseX;
  currentMouseY;
  cardToDrag;
  canvasElement;
  canvasContext;

  constructor() {}

  ngOnInit() {
    this.buildCanvas();
    this.animateCanvas();
    this.listenToPusher();
    this.listenToMouseEvents();
    this.listenToKeyboardEvents();
  }

  listenToMouseEvents() {
    window.addEventListener(('mousedown'), (e) => {
      this.oldMouseX = e.offsetX;
      this.oldMouseY = e.offsetY;
      this.cardToDrag = this.findCardOnCanvas(this.currentMouseX, this.currentMouseY);
    });

    window.addEventListener(('mouseup'), (e) => {
      if (this.cardToDrag) {
        this.pusherChannel.trigger('client-move-card', {
          card: this.cardToDrag
        });
        this.cardToDrag = null;
      }
    });

    window.addEventListener(('mousemove'), (e) => {
      this.currentMouseX = e.offsetX;
      this.currentMouseY = e.offsetY;

      if (this.cardToDrag) {
        this.cardToDrag.x += this.currentMouseX - this.oldMouseX;
        this.cardToDrag.y += this.currentMouseY - this.oldMouseY;

        this.keepCardInCanvas(this.cardToDrag);
        this.moveCardToEndOfBattlefieldArray(this.cardToDrag);

        this.oldMouseX = e.offsetX;
        this.oldMouseY = e.offsetY;
      }
    });
  }

  listenToKeyboardEvents() {
    window.addEventListener(('keydown'), (e) => {
      // tap a card
      if (e.key === 't') {
        const cardToTap = this.findCardOnCanvas(this.currentMouseX, this.currentMouseY);
        if (cardToTap && !cardToTap.tapped) {
          this.tapCard(cardToTap);

          this.pusherChannel.trigger(('client-move-card'), {
            card: cardToTap
          });
        }
      }

      // untap a card
      if (e.key === 'u') {
        const cardToUntap = this.findCardOnCanvas(this.currentMouseX, this.currentMouseY);
        if (cardToUntap && cardToUntap.tapped) {
          this.untapCard(cardToUntap);

          this.pusherChannel.trigger(('client-move-card'), {
            card: cardToUntap
          });
        }
      }

      // recall card to hand
      if (e.key === 'r') {
        const cardToRecall = this.findCardOnCanvas(this.currentMouseX, this.currentMouseY);
        if (cardToRecall) {
          this.sendCardFromBattlefieldToZone(this.currentUsername, cardToRecall, 'hand');

          this.pusherChannel.trigger(('client-change-card-zone'), {
            username: this.currentUsername,
            card: cardToRecall,
            zone: 'hand'
          });
        }
      }

      // place card in graveyard
      if (e.key === 'b') {
        const cardToBury = this.findCardOnCanvas(this.currentMouseX, this.currentMouseY);
        if (cardToBury) {
          this.sendCardFromBattlefieldToZone(this.currentUsername, cardToBury, 'graveyard');

          this.pusherChannel.trigger(('client-change-card-zone'), {
            username: this.currentUsername,
            card: cardToBury,
            zone: 'graveyard'
          });
        }
      }

      // place card in exile
      if (e.key === 'e') {
        const cardToExile = this.findCardOnCanvas(this.currentMouseX, this.currentMouseY);
        if (cardToExile) {
          this.sendCardFromBattlefieldToZone(this.currentUsername, cardToExile, 'exile');

          this.pusherChannel.trigger(('client-change-card-zone'), {
            username: this.currentUsername,
            card: cardToExile,
            zone: 'exile'
          });
        }
      }
    });
  }

  sendCardFromBattlefieldToZone(username, card, zone) {
    if (card.tapped) {
      this.untapCard(card);
    }

    const matchedPlayer = this.players.find((player) => {
      return player.username === username;
    });

    if (matchedPlayer.deck._id === card.deckId) {
      const cardIndex = this.battlefield.findIndex((cardToFind) => {
        return card.libraryId === cardToFind.libraryId;
      });

      this.battlefield.splice(cardIndex, 1);
      matchedPlayer[zone].push(card);
    } else if (username === this.currentUsername) {
      toast(`You can only send your own cards to your ${zone}`, 5000);
    }
  }

  keepCardInCanvas(card) {
    if (card.x < 0) {
      card.x = 0;
    }

    if ((card.x + card.width) > this.canvasElement.width) {
      card.x = this.canvasElement.width - card.width;
    }

    if (card.y < 0) {
      card.y = 0;
    }

    if ((card.y + card.height) > this.canvasElement.height) {
      card.y = this.canvasElement.height - card.height;
    }
  }

  untapCard(card) {
    card.tapped = false;
    this.swapCardWidthAndHeight(card);
    this.keepCardInCanvas(card);
  }

  tapCard(card) {
    card.tapped = true;
    this.swapCardWidthAndHeight(card);
    this.keepCardInCanvas(card);
  }

  swapCardWidthAndHeight(card) {
    [card.width, card.height] = [card.height, card.width];
  }

  findCardOnCanvas(x, y) {
    // look in a reversed array so the found card is the last placed on the canvas (on top)
    const reversedBattlefield = [...this.battlefield].reverse();
    return reversedBattlefield.find((card) => {
      return ((card.x < x) && (x < (card.x + card.width)) &&
              (card.y < y) && (y < (card.y + card.height)));
    });
  }

  buildCanvas() {
    this.canvasElement = document.querySelector('canvas');
    this.canvasElement.width = 1800;
    this.canvasElement.height = 400;
    this.canvasContext = this.canvasElement.getContext('2d');
  }

  animateCanvas() {
    this.canvasContext.clearRect(0, 0, this.canvasElement.width, this.canvasElement.height);

    for (const card of this.battlefield) {
      const img = new Image();
      img.src = card.imageUrls.small;
      if (card.tapped) {
        this.canvasContext.save();
        this.canvasContext.translate(card.x, card.y);
        this.canvasContext.rotate(90 * Math.PI / 180);
        this.canvasContext.drawImage(img, 0, 0, card.height, -card.width);
        this.canvasContext.restore();
      } else {
        this.canvasContext.drawImage(img, card.x, card.y, card.width, card.height);
      }
    }

    requestAnimationFrame(() => this.animateCanvas());
  }

  listenToPusher() {
    this.pusherChannel.bind('client-move-card', obj => {
      const cardToMove = this.battlefield.find((card) => {
        return ((card.deckId === obj.card.deckId) && (card.libraryId === obj.card.libraryId));
      });

      cardToMove.x = obj.card.x;
      cardToMove.y = obj.card.y;
      cardToMove.width = obj.card.width;
      cardToMove.height = obj.card.height;
      cardToMove.tapped = obj.card.tapped;

      this.moveCardToEndOfBattlefieldArray(cardToMove);
    });

    this.pusherChannel.bind('client-change-card-zone', obj => {
      this.sendCardFromBattlefieldToZone(obj.username, obj.card, obj.zone);
    });
  }

  moveCardToEndOfBattlefieldArray(card) {
    this.battlefield.splice(this.battlefield.indexOf(card), 1);
    this.battlefield.push(card);
  }
}
