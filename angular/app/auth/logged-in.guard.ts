import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { toast } from 'angular2-materialize';

import { AuthService } from './auth.service';

@Injectable()

export class LoggedInGuard implements CanActivate {

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  public canActivate(): boolean {
    if (this.authService.loggedIn()) {
      return true;
    } else {
      toast('You need to log in to visit this page', 5000);
      this.router.navigate(['/login']);
      return false;
    }
  }
}
