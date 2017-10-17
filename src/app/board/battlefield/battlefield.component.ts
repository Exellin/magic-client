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
  isDragging = false;
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
      this.isDragging = true;
      this.oldMouseX = e.offsetX;
      this.oldMouseY = e.offsetY;
    });

    window.addEventListener(('mouseup'), (e) => {
      this.isDragging = false;
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
      if (this.isDragging === true && e.srcElement === this.canvasElement) {
        this.cardToDrag = this.findCardOnCanvas(this.currentMouseX, this.currentMouseY);

        if (this.cardToDrag) {
          this.cardToDrag.x += this.currentMouseX - this.oldMouseX;
          this.cardToDrag.y += this.currentMouseY - this.oldMouseY;

          this.keepCardInCanvas(this.cardToDrag);
          this.moveCardToBegginingOfBattlefieldArray(this.cardToDrag);

          this.oldMouseX = e.offsetX;
          this.oldMouseY = e.offsetY;
        }
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
          this.recallCardToHand(this.currentUsername, cardToRecall);

          this.pusherChannel.trigger(('client-recall-card'), {
            username: this.currentUsername,
            card: cardToRecall
          });
        }
      }
    });
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

  recallCardToHand(username, cardToRecall) {
    if (cardToRecall.tapped) {
      this.untapCard(cardToRecall);
    }
    const matchedPlayer = this.players.find((player) => {
      return player.username === username;
    });

    if (matchedPlayer.deck._id === cardToRecall.deckId) {
      const cardIndex = this.battlefield.findIndex((card) => {
        return card.libraryId === cardToRecall.libraryId;
      });

      this.battlefield.splice(cardIndex, 1);
      matchedPlayer.hand.push(cardToRecall);
    } else {
      toast('You can only recall cards in your deck', 5000);
    }
  }

  findCardOnCanvas(x, y) {
    return this.battlefield.find((card) => {
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

      this.moveCardToBegginingOfBattlefieldArray(cardToMove);
    });

    this.pusherChannel.bind('client-recall-card', obj => {
      this.recallCardToHand(obj.username, obj.card);
    });
  }

  moveCardToBegginingOfBattlefieldArray(card) {
    this.battlefield.splice(this.battlefield.indexOf(card), 1);
    this.battlefield.unshift(card);
  }
}
