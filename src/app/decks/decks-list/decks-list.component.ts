import { Component, OnInit, Input } from '@angular/core';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { toast } from 'angular2-materialize';

import { DeckService } from '../deck.service';

@Component({
  selector: 'app-decks-list',
  templateUrl: './decks-list.component.html',
  styleUrls: ['./decks-list.component.scss'],
})

export class DecksListComponent implements OnInit {
  @Input() decks;
  @Input() isCurrentUser;
  deckForm: FormGroup;

  nameErrors = [
    { name: 'required', text: 'Name is required', rules: ['touched'] },
    { name: 'maxlength', text: 'Max length is 50', rules: ['touched'] }
  ];

  name = new FormControl('', [Validators.required,
                              Validators.maxLength(50)]);

  constructor(
    private formBuilder: FormBuilder,
    private deckService: DeckService) {}

  ngOnInit() {
    this.deckForm = this.formBuilder.group({
      name: this.name
    });
  }

  setClass(field) {
    return { 'invalid': this[field].touched && !this[field].valid };
  }

  deckSubmit() {
    this.deckService.createDeck(this.deckForm.value).subscribe(
      res => {
        const newDeck = res.data;
        this.decks.push(newDeck);
        this.deckForm.reset();
        toast('Deck created successfully', 5000);
      },
      err => {
        toast('Unable to create deck', 5000);
      }
    );
  }
}
