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
    const promises = [];

    for (const newCard of newCardsArray) {
      promises.push(this.processCard(newCard));
    }

    Promise.all(promises).then(() => {
      this.deckService.updateDeck(this.deck).subscribe(
        res => {},
        err => {
          console.log(err);
        }
      );
    });

    Promise.all(promises).catch((err) => {
      console.log(err);
    });
  }

  processCard(newCard) {
    return new Promise((resolve, reject) => {
      const quantityAndName = newCard.split(/ (.+)/);
      const quantityString = quantityAndName[0];
      const cardName = quantityAndName[1];
      const parsedQuantity = parseInt(quantityString, 10);

      if (!parsedQuantity) {
        toast(`${quantityString} is not a number`, 5000);
        return resolve();
      }

      if (!cardName) {
        toast(`no card name found next to ${quantityString}`, 5000);
        return resolve();
      }

      if (parsedQuantity > 100) {
        toast(`Can only import a max of 100 ${cardName} at a time`, 5000);
        return resolve();
      }

      if (parsedQuantity < 1) {
        toast(`Can only import a positive number of ${cardName}`, 5000);
        return resolve();
      }

      const match = this.deck.cards.find(card => card.name.toUpperCase() === cardName.toUpperCase());

      if (match) {
        match.quantity += parsedQuantity;
        toast(`${match.name} quantity increased by ${parsedQuantity}`, 5000);
        resolve();
      } else {
        const checkCardPromise = this.checkCardExistence(cardName);

        checkCardPromise.then((cardExists) => {
          if (cardExists) {
            const importPromise = this.importCardFromDataBase(cardName, parsedQuantity);

            importPromise.then(() => {
              resolve();
            });

            importPromise.catch((err) => {
              reject(err);
            });
          } else {
            const importPromise = this.importCardFromApi(cardName, parsedQuantity);

            importPromise.then((card: any) => {
              if (card.layout === 'double-faced') {
                const transformPromise = this.importCardFromApi(card.names[1], 0);
                transformPromise.then((transformCard) => {
                  resolve();
                });
                transformPromise.catch((err) => {
                  reject(err);
                });
              }
              resolve();
            });

            importPromise.catch((err) => {
              reject(err);
            });
          }
        });

        checkCardPromise.catch((err) => {
          reject(err);
        });
      }
    });
  }

  importCardFromApi(cardName, quantity) {
    return new Promise((resolve, reject) => {
      this.cardsService.getCardFromApi(cardName).subscribe(
        res => {
          if (res.cards.length === 0) {
            toast(`${cardName} is not a valid card name`, 5000);
            return resolve();
          }

          let fetchedCard = res.cards[0];

          if (fetchedCard.set === 'MPS_AKH') {
            fetchedCard = res.cards[1];
          }

          const properties = ['name', 'layout', 'cmc', 'colors', 'colorIdentity', 'type', 'supertypes', 'types', 'subtypes', 'rarity',
                              'setName', 'text', 'flavor', 'number', 'power', 'toughness', 'loyalty', 'legalities', 'multiverseid',
                              'names', 'manaCost', 'rulings', 'printings'];

          const cardToSave = {
            setCode: fetchedCard.set
          };

          for (const property of properties) {
            if (fetchedCard.hasOwnProperty(property)) {
              cardToSave[property] = fetchedCard[property];
            }
          }

          const saveCardPromise = this.saveCard(cardToSave, quantity);
          saveCardPromise.then(() => {
            resolve(cardToSave);
          });
          saveCardPromise.catch((err) => {
            reject(err);
          });
        },
        err => {
          reject(err);
        }
      );
    });
  }

  importCardFromDataBase(cardName, quantity) {
    return new Promise((resolve, reject) => {
      this.cardsService.getCardFromDatabase(cardName).subscribe(
        res => {
          const fetchedCard = res.data;
          this.addCardToDeck(fetchedCard, quantity);
          resolve();
        },
        err => {
          reject(err);
        }
      );
    });
  }

  saveCard(card, quantity) {
    return new Promise((resolve, reject) => {
      this.cardsService.saveCard(card).subscribe(
        res => {
          // only save the card to the deck if it isn't a transform card
          if (quantity > 0) {
            const savedCard = res.data;
            this.addCardToDeck(savedCard, quantity);
            resolve();
          }
        },
        err => {
          reject(err);
        }
      );
    });
  }

  addCardToDeck(card, quantity) {
    card.quantity = quantity;
    this.deck.cards.push(card);
  }

  checkCardExistence(cardName) {
    return new Promise((resolve, reject) => {
      this.cardsService.getCardFromDatabase(cardName).subscribe(
        res => {
          if (res.data) {
            resolve(true);
          } else {
            resolve(false);
          }
        },
        err => {
          reject(err);
        }
      );
    });
  }
}
