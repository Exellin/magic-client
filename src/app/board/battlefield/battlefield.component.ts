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
  isDraggingCard;
  canvasElement;
  canvasContext;
  isSelecting = false;
  selectArea = {x: 0, y: 0, width: 0, height: 0};
  selected = [];
  cardBackUrl = 'https://mtg.gamepedia.com/media/mtg.gamepedia.com/f/f8/Magic_card_back.jpg?version=4694fa6f8c95cfc758855c8ed4c4d0c0';

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
      this.isDraggingCard = this.findCardOnCanvas(this.currentMouseX, this.currentMouseY);

      if (!this.isDraggingCard) {
        this.selected = [];
        this.battlefield.map(card => card.selected = false);
        this.selectArea.x = this.currentMouseX;
        this.selectArea.y = this.currentMouseY;
        this.isSelecting = true;
      }
    });

    window.addEventListener(('mouseup'), (e) => {
      if (this.isDraggingCard) {
        this.pusherChannel.trigger('client-move-cards', {
          cardsToSend: this.sendSelectedThroughPusher()
        });
        this.isDraggingCard = false;
      } else if (this.isSelecting) {
        if (this.selectArea.width < 0) {
          this.selectArea.x += this.selectArea.width;
          this.selectArea.width *= -1;
        }
        if (this.selectArea.height < 0) {
          this.selectArea.y += this.selectArea.height;
          this.selectArea.height *= -1;
        }
        for (const card of this.battlefield) {
          if (this.rectOverlap(card, this.selectArea)) {
            this.selected.push(card);
            card.selected = true;
          }
        }
        this.selectArea.width = 0;
        this.selectArea.height = 0;
        this.isSelecting = false;
      }
    });

    window.addEventListener(('mousemove'), (e) => {
      this.currentMouseX = e.offsetX;
      this.currentMouseY = e.offsetY;

      if (this.selected.length > 0 && this.isDraggingCard) {
        if (this.selected.length > 100) {
          toast('You can only move up to 100 cards at a time', 5000);
          return;
        }
        for (const cardToDrag of this.selected) {
          cardToDrag.x += this.currentMouseX - this.oldMouseX;
          cardToDrag.y += this.currentMouseY - this.oldMouseY;

          this.keepCardInCanvas(cardToDrag);
          this.moveCardToEndOfBattlefieldArray(cardToDrag);
        }

        this.oldMouseX = e.offsetX;
        this.oldMouseY = e.offsetY;
      } else if (this.isSelecting) {
        this.selectArea.width = this.currentMouseX - this.selectArea.x;
        this.selectArea.height = this.currentMouseY - this.selectArea.y;
      }
    });
  }

  listenToKeyboardEvents() {
    window.addEventListener(('keydown'), (e) => {
      // tap cards
      if (e.key === 't') {
        if (this.selected.length > 100) {
          toast('You can only tap up to 100 cards at a time', 5000);
          return;
        }

        if (this.findCardOnCanvas(this.currentMouseX, this.currentMouseY)) {
          for (const card of this.selected) {
            this.tapCard(card);
          }

          this.pusherChannel.trigger(('client-move-cards'), {
            cardsToSend: this.sendSelectedThroughPusher()
          });
        }
      }

      // untap cards
      if (e.key === 'u') {
        if (this.selected.length > 100) {
          toast('You can only untap up to 100 cards at a time', 5000);
          return;
        }

        if (this.findCardOnCanvas(this.currentMouseX, this.currentMouseY)) {
          for (const card of this.selected) {
            this.untapCard(card);
          }

          this.pusherChannel.trigger(('client-move-cards'), {
            cardsToSend: this.sendSelectedThroughPusher()
          });
        }
      }

        // flip cards
        if (e.key === 'f') {
          if (this.selected.length > 100) {
            toast('You can only flip up to 100 cards at a time', 5000);
            return;
          }

          if (this.findCardOnCanvas(this.currentMouseX, this.currentMouseY)) {
            for (const card of this.selected) {
              this.flipCard(card);
            }

            this.pusherChannel.trigger(('client-move-cards'), {
              cardsToSend: this.sendSelectedThroughPusher()
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
    if (card.tapped) {
      card.tapped = false;
      this.swapCardWidthAndHeight(card);
      this.keepCardInCanvas(card);
    }
  }

  tapCard(card) {
    if (!card.tapped) {
      card.tapped = true;
      this.swapCardWidthAndHeight(card);
      this.keepCardInCanvas(card);
    }
  }

  flipCard(card) {
    if (card.flipped) {
      card.flipped = false;
    } else {
      card.flipped = true;
    }
  }

  swapCardWidthAndHeight(card) {
    [card.width, card.height] = [card.height, card.width];
  }

  findCardOnCanvas(x, y) {
    // look in a reversed array so the found card is the last placed on the canvas (on top)
    const reversedBattlefield = [...this.battlefield].reverse();
    const foundCard = reversedBattlefield.find((card) => {
      return ((card.x < x) && (x < (card.x + card.width)) &&
              (card.y < y) && (y < (card.y + card.height)));
    });
    if (foundCard && !foundCard.selected) {
      this.selected = [];
      this.battlefield.map(card => card.selected = false);
      this.selected.push(foundCard);
      foundCard.selected = true;
    }
    return foundCard;
  }

  buildCanvas() {
    this.canvasElement = document.querySelector('canvas');
    this.canvasElement.width = window.innerWidth;
    this.canvasElement.height = window.innerHeight;
    this.canvasContext = this.canvasElement.getContext('2d');
  }

  animateCanvas() {
    this.canvasContext.beginPath();
    this.canvasContext.clearRect(0, 0, this.canvasElement.width, this.canvasElement.height);

    // Create an image for each card before drawing to canvas to prevent flickering
    this.battlefield.map(card => {
      card.img = new Image();
      if (card.flipped) {
        card.img.src = this.cardBackUrl;
      } else {
        card.img.src = card.imageUrls.small;
      }
    });

    for (const card of this.battlefield) {
      if (card.tapped) {
        this.canvasContext.save();
        this.canvasContext.translate(card.x, card.y);
        this.canvasContext.rotate(90 * Math.PI / 180);
        this.canvasContext.drawImage(card.img, 0, 0, card.height, -card.width);
        this.canvasContext.restore();
      } else {
        this.canvasContext.drawImage(card.img, card.x, card.y, card.width, card.height);
      }

      if (card.selected) {
        this.canvasContext.strokeStyle = '#ffeb3b';
        this.canvasContext.lineWidth = 5;
        this.canvasContext.rect(card.x, card.y, card.width, card.height);
        this.canvasContext.stroke();
      }
    }

    if (this.isSelecting) {
      this.canvasContext.strokeStyle = '#000000';
      this.canvasContext.lineWidth = 1;
      this.canvasContext.rect(this.selectArea.x, this.selectArea.y, this.selectArea.width, this.selectArea.height);
      this.canvasContext.stroke();
    }

    requestAnimationFrame(() => this.animateCanvas());
  }

  rectOverlap(rect1, rect2) {
    return (!((rect1.y + rect1.height) < rect2.y || (rect2.y + rect2.height) < rect1.y ||
              (rect1.x + rect1.width) < rect2.x || (rect2.x + rect2.width) < rect1.x));
  }

  listenToPusher() {
    this.pusherChannel.bind('client-move-cards', obj => {
      for (const cardObj of obj.cardsToSend) {
        const cardToMove = this.battlefield.find((card) => {
          return ((card.deckId === cardObj.deckId) && (card.libraryId === cardObj.libraryId));
        });

        cardToMove.x = cardObj.x;
        cardToMove.y = cardObj.y;
        cardToMove.width = cardObj.tapped ? 204 : 146;
        cardToMove.height = cardObj.tapped ? 146 : 204;
        cardToMove.tapped = cardObj.tapped;

        this.moveCardToEndOfBattlefieldArray(cardToMove);
      }
    });

    this.pusherChannel.bind('client-change-card-zone', obj => {
      this.sendCardFromBattlefieldToZone(obj.username, obj.card, obj.zone);
    });
  }

  moveCardToEndOfBattlefieldArray(card) {
    this.battlefield.splice(this.battlefield.indexOf(card), 1);
    this.battlefield.push(card);
  }

  sendSelectedThroughPusher() {
    const cardsToSend = [];
    for (const card of this.selected) {
      const cardToSend = {
        x: card.x,
        y: card.y,
        tapped: card.tapped,
        flipped: card.flipped,
        libraryId: card.libraryId,
        deckId: card.deckId
      };
      cardsToSend.push(cardToSend);
    }

    return cardsToSend;
  }
}
