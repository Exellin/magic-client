import { Component, OnInit, OnDestroy, EventEmitter } from '@angular/core';
import { toast } from 'angular2-materialize';
import { MaterializeAction } from 'angular2-materialize';

import { DeckService } from '../decks/deck.service';
import { environment } from '../../environments/environment';
import { ProfileService } from '../profile/profile.service';

declare const Pusher;

@Component({
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.scss']
})

export class BoardComponent implements OnInit, OnDestroy {
  pusherChannel;
  gameId;
  players = [];
  currentUserDecks;
  showNavbar = false;
  currentUsername;
  canvasContainer;
  canvasElement;
  canvasContext;
  isDragging = false;
  battlefield = [];
  oldMouseX;
  oldMouseY;
  currentMouseX;
  currentMouseY;
  cardToDrag;

  modalActions = new EventEmitter<string|MaterializeAction>();

  constructor(
    private deckService: DeckService,
    private profileService: ProfileService
  ) {}

  ngOnInit() {
    this.initCanvas();
    this.initPusher();
    this.listenForChanges();
  }

  ngOnDestroy() {
    this.pusherChannel.unsubscribe(this.gameId);
  }

  initCanvas() {
    this.buildCanvas();
    this.animateCanvas();
    this.resizeCanvas();

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

          this.moveCardToBegginingOfBattlefieldArray(this.cardToDrag);

          this.oldMouseX = e.offsetX;
          this.oldMouseY = e.offsetY;
        }
      }
    });

    window.addEventListener(('keydown'), (e) => {
      // tap a card
      if (e.key === 't') {
        const cardToTap = this.findCardOnCanvas(this.currentMouseX, this.currentMouseY);
        if (cardToTap && !cardToTap.tapped) {
          cardToTap.tapped = true;
          [cardToTap.width, cardToTap.height] = [cardToTap.height, cardToTap.width];
        }
        this.pusherChannel.trigger(('client-move-card'), {
          card: cardToTap
        });
      }

      // untap a card
      if (e.key === 'u') {
        const cardToUntap = this.findCardOnCanvas(this.currentMouseX, this.currentMouseY);
        if (cardToUntap && cardToUntap.tapped) {
          cardToUntap.tapped = false;
          [cardToUntap.width, cardToUntap.height] = [cardToUntap.height, cardToUntap.width];
        }
        this.pusherChannel.trigger(('client-move-card'), {
          card: cardToUntap
        });
      }
    });
  }

  findCardOnCanvas(x, y) {
    return this.battlefield.find((card) => {
      return ((card.x < x) && (x < (card.x + card.width)) &&
              (card.y < y) && (y < (card.y + card.height)));
    });
  }

  buildCanvas() {
    this.canvasContainer = document.querySelector('.canvas-container');
    this.canvasElement = document.querySelector('canvas');
    this.canvasContext = this.canvasElement.getContext('2d');
  }

  resizeCanvas() {
    this.canvasElement.width = 1800;
    this.canvasElement.height = 400;
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

      const match = this.players.find((player) => {
        return player.username === member.info.username;
      });

      if (!match) {
        this.players.push(member.info);
      }
    });

    this.pusherChannel.bind('pusher:subscription_succeeded', members => {
      toast('connected', 5000);
      this.currentUsername = members.me.info.username;
      this.setCurrentUserDecks(members.me.info.username);
      const membersArray = Object.entries(members.members);
      for (const member of membersArray) {
        this.players.push(member[1]);
      }
    });

    this.pusherChannel.bind('pusher:member_removed', member => {
      toast(`${member.info.username} left the game`, 5000);
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

  selectDeck(deck) {
    this.pusherChannel.trigger('client-assign-deck-to-player', {
      deck: {
        _id: deck._id,
        owner: {
          username: deck.owner.username
        }
      }
    });

    this.assignDeck(deck);
  }

  assignDeck(deck) {
    const match = this.players.find((player) => {
      return player.username === deck.owner.username;
    });
    const playerIndex = this.players.indexOf(match);

    this.deckService.getDeck(deck._id).subscribe(
      res => {
        this.players[playerIndex].deck = res.data;
      },
      err => {
        console.log(err);
      }
    );
  }

  listenForChanges() {
    this.pusherChannel.bind('client-assign-deck-to-player', obj => {
      this.assignDeck(obj.deck);
    });

    this.pusherChannel.bind('client-update-player-data', obj => {
      this.players = obj.players;
    });

    this.pusherChannel.bind('client-draw-card', obj => {
      const playerIndex = this.players.findIndex((player) => {
        return player.username === obj.username;
      });
      this.players[playerIndex].hand.push(this.players[playerIndex].library.shift());
    });

    this.pusherChannel.bind('client-shuffle-library', obj => {
      const library = [];
      const playerIndex = this.players.findIndex((player) => {
        return player.username === obj.username;
      });

      for (const id of obj.IdArray) {
        const match = this.players[playerIndex].deck.cards.find((card) => {
          return id === card.libraryId;
        });
        library.push(match);
      }

      this.players[playerIndex].library = library;
    });

    this.pusherChannel.bind('client-lock-in-deck', obj => {
      const playerIndex = this.players.findIndex((player) => {
        return player.username === obj.username;
      });

      this.players[playerIndex].deckLockedIn = true;
    });

    this.pusherChannel.bind('client-place-card-on-battlefield', obj => {
      const playerIndex = this.players.findIndex((player) => {
        return player.username === obj.username;
      });

      this.players[playerIndex].hand.splice(this.players[playerIndex].hand.indexOf(obj.card), 1);
      this.battlefield.push(obj.card);
    });

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
  }

  moveCardToBegginingOfBattlefieldArray(card) {
    this.battlefield.splice(this.battlefield.indexOf(card), 1);
    this.battlefield.unshift(card);
  }

  updatePlayerData() {
    this.pusherChannel.trigger('client-update-player-data', {
      players: this.players
    });
  }

  openModal() {
    this.modalActions.emit({action: 'modal', params: ['open']});
  }

  closeModal() {
    this.modalActions.emit({action: 'modal', params: ['close']});
  }

  setCurrentUserDecks(username) {
    this.profileService.getUser(username).subscribe(
      res => {
        this.currentUserDecks = res.user.decks;
      },
      err => {
        console.log(err);
      }
    );
  }

  toggleNavbar() {
    this.showNavbar = !this.showNavbar;
  }
}
