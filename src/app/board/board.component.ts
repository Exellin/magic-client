import { Component, OnInit, OnDestroy, EventEmitter, AfterViewInit } from '@angular/core';
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

export class BoardComponent implements OnInit, OnDestroy, AfterViewInit {
  pusherChannel;
  gameId;
  players = [];
  currentUserDecks;
  showNavbar = false;
  currentUsername;
  battlefield = [];

  decksModal = new EventEmitter<string|MaterializeAction>();

  constructor(
    private deckService: DeckService,
    private profileService: ProfileService
  ) {}

  ngOnInit() {
    this.initPusher();
    this.listenForChanges();
  }

  ngAfterViewInit() {
    this.decksModal.emit({action: 'modal', params: ['open']});
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

      const match = this.players.find(player => player.username === member.info.username);

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

  createLibrary(deck) {
    let id = 0;
    for (const card of deck.cards) {
      for (let i = 0; i < card.quantity; i++) {
        const cardWithId = {
          ...card,
          libraryId: id
        };
        const playerIndex = this.players.findIndex(player => player.username === deck.owner.username);
        this.players[playerIndex].library.push(cardWithId);
        id++;
      }
    }
  }

  convertLibraryToCardsWithIds(library) {
    const cardArray = [];
    for (const card of library) {
      const cardToSend = [card.libraryId, card.multiverseid];
      cardArray.push(cardToSend);
    }
    return cardArray;
  }

  shuffleLibrary(username, library) {
    // Durstenfeld shuffle from https://en.wikipedia.org/wiki/Fisher%E2%80%93Yates_shuffle#The_modern_algorithm
    for (let i = library.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [library[i], library[j]] = [library[j], library[i]];
    }
    const cardArray = this.convertLibraryToCardsWithIds(library);
    this.pusherChannel.trigger('client-shuffle-library', {
      cardArray,
      username
    });
  }

  assignDeck(deck) {
    const playerIndex = this.players.findIndex(player => player.username === deck.owner.username);

    this.deckService.getDeck(deck._id).subscribe(
      res => {
        this.players[playerIndex].deck = res.data;
        this.players[playerIndex].library = [];
        this.createLibrary(this.players[playerIndex].deck);
        this.shuffleLibrary(deck.owner.username, this.players[playerIndex].library);
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
      const playerIndex = this.players.findIndex(player => player.username === obj.username);
      this.players[playerIndex].hand.push(this.players[playerIndex].library.shift());
    });

    this.pusherChannel.bind('client-shuffle-library', obj => {
      const library = [];
      const playerIndex = this.players.findIndex(player => player.username === obj.username);

      for (const card of obj.cardArray) {
        const match = this.players[playerIndex].deck.cards.find(cardInDeck => card[1] === cardInDeck.multiverseid);
        match.libraryId = card[0];
        library.push(match);
      }

      this.players[playerIndex].library = library;
    });

    this.pusherChannel.bind('client-place-card-on-battlefield', obj => {
      const playerIndex = this.players.findIndex(player => player.username === obj.username);
      this.players[playerIndex].hand.splice(this.players[playerIndex].hand.indexOf(obj.card), 1);
      this.battlefield.push(obj.card);
    });
  }

  updatePlayerData() {
    this.pusherChannel.trigger('client-update-player-data', {
      players: this.players
    });
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
