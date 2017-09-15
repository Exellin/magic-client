import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { toast } from 'angular2-materialize';

import { AuthService } from '../../auth/auth.service';
import { DeckService } from '../deck.service';
import { CardsService } from '../../cards/cards.service';

@Component({
  selector: 'app-deck',
  templateUrl: './deck.component.html',
  styleUrls: ['./deck.component.scss']
})

export class DeckComponent implements OnInit {
  deck;
  ownedByCurrentUser = false;
  paramsSubscription;
  addCardsForm: FormGroup;

  new_card_list = new FormControl('', [Validators.required]);

  constructor(
    private activatedRoute: ActivatedRoute,
    private authService: AuthService,
    private cardsService: CardsService,
    private deckService: DeckService,
    private formBuilder: FormBuilder
  ) {}

  ngOnInit() {
    this.paramsSubscription = this.activatedRoute.params.subscribe(
      params => {
        this.setDeckData(params['id']);
      }
    );

    this.addCardsForm = this.formBuilder.group({
      new_card_list: this.new_card_list
    });
  }

  setDeckData(deckId) {
    this.deckService.getDeck(deckId).subscribe(
      res => {
        this.deck = res.data;

        this.authService.currentUser.subscribe(
          currentUser => {
            if (this.deck.owner._id === currentUser.id) {
              this.ownedByCurrentUser = true;
            }
          },
          err => {
            console.log(err);
          }
        );
      }
    );
  }

  addCardsSubmit() {
    const newCardsArray = this.addCardsForm.value.new_card_list.split('\n');
    for (const newCard of newCardsArray) {
      const quantityAndName = newCard.split(/ (.+)/);
      const quantityString = quantityAndName[0];
      const cardName = quantityAndName[1];
      const parsedQuantity = parseInt(quantityString, 10);

      if (!parsedQuantity) {
        toast(`${quantityString} is not a number`, 5000);
        continue;
      }

      if (!cardName) {
        toast(`no card name found next to ${quantityString}`, 5000);
        continue;
      }

      const match = this.deck.cards.find((card) => {
        return card.name.toUpperCase() === cardName.toUpperCase();
      });

      if (match) {
        match.quantity += parsedQuantity;
        this.cardsService.updateCard(this.deck._id, match).subscribe(
          res => {
            toast(`${match.name} quantity increased by ${parsedQuantity}`, 5000);
          },
          err => {
            console.log(err);
          }
        );
      } else {
        this.cardsService.getCard(cardName).subscribe(
          res => {
            const fetchedCard = res.cards[0];
            if (fetchedCard) {
              const cardToSave = {
                quantity: parsedQuantity,
                name: fetchedCard.name,
                imageUrl: fetchedCard.imageUrl
              };
              this.importCard(this.deck._id, cardToSave);
            } else {
              toast(`${cardName} could not be imported`, 5000);
            }
          },
          err => {
            console.log(err);
          }
        );
      }
    }
  }

  importCard(deckId, card) {
    this.cardsService.addCardToDeck(deckId, card).subscribe(
      res => {
        this.deck.cards.push(card);
      },
      err => {
        console.log(err);
      }
    );
  }
}
