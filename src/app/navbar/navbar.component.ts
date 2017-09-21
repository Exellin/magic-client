import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { toast } from 'angular2-materialize';

import { AuthService } from '../auth/auth.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})

export class NavbarComponent implements OnInit {
  username = '';

  constructor(
    private authService: AuthService,
    private router: Router) {}

  ngOnInit() {
    this.authService.currentUser.subscribe(
      currentUser => {
        this.username = currentUser.username;
      },
      err => {
        console.log(err);
      }
    );
  }

  isLoggedIn() {
    return this.authService.loggedIn();
  }

  logoutClick() {
    this.authService.logout();
    toast('Logged out', 5000);
    this.router.navigate(['/']);
  }
}
