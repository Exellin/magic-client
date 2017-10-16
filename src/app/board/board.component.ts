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
  mouseX;
  mouseY;

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
      this.mouseX = e.clientX;
      this.mouseY = e.clientY;
    });

    window.addEventListener(('mouseup'), (e) => {
      this.isDragging = false;
    });

    window.addEventListener(('mousemove'), (e) => {
      if (this.isDragging === true && e.srcElement === this.canvasElement) {
        const cardToDrag = this.battlefield.find((card) => {
          return ((card.x < e.offsetX) && (e.offsetX < (card.x + card.width)) &&
                  (card.y < e.offsetY) && (e.offsetY < (card.y + card.height)));
        });

        if (cardToDrag) {
          cardToDrag.x += e.clientX - this.mouseX;
          cardToDrag.y += e.clientY - this.mouseY;

          this.battlefield.splice(this.battlefield.indexOf(cardToDrag), 1);
          this.battlefield.unshift(cardToDrag);

          this.mouseX = e.clientX;
          this.mouseY = e.clientY;
        }
      }
    });
  }

  buildCanvas() {
    this.canvasContainer = document.querySelector('.canvas-container');
    this.canvasElement = document.querySelector('canvas');
    this.canvasContext = this.canvasElement.getContext('2d');
  }

  resizeCanvas() {
    this.canvasElement.width = this.canvasContainer.clientWidth;
    this.canvasElement.height = 400;
  }

  animateCanvas() {
    this.canvasContext.clearRect(0, 0, this.canvasElement.width, this.canvasElement.height);

    for (const card of this.battlefield) {
      const img = new Image();
      img.src = card.imageUrls.small;
      this.canvasContext.drawImage(img, card.x, card.y);
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
