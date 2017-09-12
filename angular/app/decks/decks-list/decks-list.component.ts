import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-decks-list',
  templateUrl: './decks-list.component.html',
  styleUrls: ['./decks-list.component.scss'],
})

export class DecksListComponent implements OnInit {
  @Input()
  decks;

  constructor() {}

  ngOnInit() {
  }
}
