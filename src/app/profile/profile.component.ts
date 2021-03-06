import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { AuthService } from '../auth/auth.service';
import { ProfileService} from './profile.service';

@Component({
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})

export class ProfileComponent implements OnInit {
  username = '';
  decks = [];
  paramsSubscription;
  isCurrentUser;

  constructor(
    private authService: AuthService,
    private profileService: ProfileService,
    private activatedRoute: ActivatedRoute) {}

  ngOnInit() {
    this.paramsSubscription = this.activatedRoute.params.subscribe(
      params => {
        this.setUserData(params['username']);
      }
    );
  }

  setUserData(usernameQuery) {
    this.isCurrentUser = false;
    this.profileService.getUser(usernameQuery).subscribe(
      res => {
        this.username = res.user.username;
        this.decks = res.user.decks;

        this.authService.currentUser.subscribe(
          currentUser => {
            if (this.username === currentUser.username) {
              this.isCurrentUser = true;
            }
          },
          err => {
            console.log(err);
          }
        );
      }
    );
  }
}
