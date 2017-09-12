import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { ProfileService} from './profile.service';

@Component({
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})

export class ProfileComponent implements OnInit {
  username = '';
  decks = [];
  paramsSubscription;

  constructor(
    private profileService: ProfileService,
    private activatedRoute: ActivatedRoute) {}

  ngOnInit() {
    this.paramsSubscription = this.activatedRoute.params.subscribe(
      params => {
        const usernameQuery = params['username'];
        this.setUsername(usernameQuery);
      }
    );
  }

  setUsername(usernameQuery) {
    this.profileService.getUser(usernameQuery).subscribe(
      res => {
        this.username = res.user.username;
        this.decks = res.user.decks;
      },
      err => {
        console.log(err);
      }
    );
  }
}
