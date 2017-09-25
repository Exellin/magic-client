import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-player-area',
  templateUrl: './player-area.component.html',
  styleUrls: ['./player-area.component.scss']
})

export class PlayerAreaComponent implements OnInit {
  @Input() player;

  constructor() {}

  ngOnInit() {
  }

}
