import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { LoginComponent } from './auth/login/login.component';
import { RegisterComponent} from './auth/register/register.component';
import { BoardComponent } from './board/board.component';
import { ProfileComponent } from './profile/profile.component';
import { DeckComponent } from './decks/deck/deck.component';
import { LoggedInGuard } from './auth/logged-in.guard';
import { LoggedOutGuard } from './auth/logged-out.guard';

const routes: Routes = [
  { path: 'login', component: LoginComponent, canActivate: [LoggedOutGuard] },
  { path: 'register', component: RegisterComponent, canActivate: [LoggedOutGuard] },
  { path: 'board', component: BoardComponent, canActivate: [LoggedInGuard] },
  { path: 'user/:username', component: ProfileComponent },
  { path: 'decks/:id', component: DeckComponent }
];

@NgModule({
  exports: [ RouterModule ],
  imports: [ RouterModule.forRoot(routes) ]
})

export class RoutingModule {}
