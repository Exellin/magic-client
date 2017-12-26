import { Component, OnInit, OnDestroy, EventEmitter, AfterViewInit } from '@angular/core';
import { toast } from 'angular2-materialize';
import { MaterializeAction } from 'angular2-materialize';

import { CardsService } from '../cards/cards.service';
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
  currentUsername;
  battlefield = [];
  cardWidth = 111;
  cardHeight = 153;

  decksModal = new EventEmitter<string|MaterializeAction>();

  constructor(
    private cardsService: CardsService,
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

      if (!this.players.find(player => player.username === member.info.username)) {
        this.players.push(member.info);
        this.players.sort((a, b) => a.username > b.username ? 1 : -1);
        this.generateHandAreas();
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
      this.players.sort((a, b) => a.username > b.username ? 1 : -1);
      this.generateHandAreas();
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
    return new Promise((resolve, reject) => {
      let id = 0;
      const totalCards = deck.cards.reduce((total, card) => {
        return total + card.quantity;
      }, 0);
      for (const card of deck.cards) {
        const hasTransformPromise = this.checkForTransform(card);
        this.assignImageUrls(card);

        hasTransformPromise.then(() => {
          for (let i = 0; i < card.quantity; i++) {
            const cardWithId = {
              ...card,
              libraryId: id
            };
            const playerIndex = this.players.findIndex(player => player.username === deck.owner.username);
            this.players[playerIndex].library.push(cardWithId);
            id++;
            if (id === totalCards) {
              resolve();
            }
          }
        });

        hasTransformPromise.catch((err) => {
          reject(err);
        });
      }
    });
  }

  checkForTransform(card) {
    return new Promise((resolve, reject) => {
      if (card.layout !== 'double-faced') { return resolve(); }
      this.cardsService.getCardFromDatabase(card.names[1]).subscribe(
        res => {
          card.transform = res.data;
          this.assignImageUrls(card.transform);
          resolve();
        },
        err => {
          reject(err);
        }
      );
    });
  }

  assignImageUrls(card) {
    card.imageUrls = {};
    card.imageUrls.small = `http://gatherer.wizards.com/Handlers/Image.ashx?multiverseid=${card.multiverseid}&type=card`;
    if (card.number) {
      card.imageUrls.large =
      `https://img.scryfall.com/cards/large/en/${card.setCode.toLowerCase()}/${card.number}.jpg`;
    } else {
      card.imageUrls.large =
      `http://gatherer.wizards.com/Handlers/Image.ashx?multiverseid=${card.multiverseid}&type=card`;
    }
  }

  assignDeck(deck) {
    const playerIndex = this.players.findIndex(player => player.username === deck.owner.username);

    this.deckService.getDeck(deck._id).subscribe(
      res => {
        this.players[playerIndex].deck = res.data;
        this.players[playerIndex].library = [];
        const createLibraryPromise = this.createLibrary(this.players[playerIndex].deck);
        createLibraryPromise.then(() => {
          for (const card of this.players[playerIndex].library) {
            card.width = this.cardWidth;
            card.height = this.cardHeight;
            card.x = 0;
            card.y = 0;
            card.img = new Image();
            card.img.src = card.imageUrls.small;
            card.deckId = this.players[playerIndex].deck._id;
            this.battlefield.push(card);
          }
        });

        createLibraryPromise.catch((err) => {
          console.log(err);
        });
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

  generateHandAreas() {
    let xStarts = [];
    let yStarts = [];
    if (this.players.length <= 2) {
      xStarts = [(window.innerWidth - this.cardWidth * 7) / 2 , (window.innerWidth - this.cardWidth * 7) / 2];
      yStarts = [0, window.innerHeight - this.cardHeight];
    } else {
      xStarts = [0, window.innerWidth - this.cardWidth * 7, window.innerWidth - this.cardWidth * 7, 0];
      yStarts = [0, 0, window.innerHeight - this.cardHeight, window.innerHeight - this.cardHeight];
    }
    for (const player of this.players) {
      player.handArea = {};
      player.handArea.width = this.cardWidth * 7;
      player.handArea.height = this.cardHeight;
      const playerIndex = this.players.indexOf(player);
      player.handArea.x = xStarts[playerIndex];
      player.handArea.y = yStarts[playerIndex];
    }
  }
}
