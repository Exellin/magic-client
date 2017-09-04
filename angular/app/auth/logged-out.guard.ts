import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { toast } from 'angular2-materialize';

import { AuthService } from './auth.service';

@Injectable()

export class LoggedOutGuard implements CanActivate {

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  public canActivate(): boolean {
    if (!this.authService.loggedIn()) {
      return true;
    } else {
      toast('You are already logged in', 5000);
      this.router.navigate(['/']);
      return false;
    }
  }
}
