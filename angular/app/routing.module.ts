import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { LoginComponent } from './auth/login/login.component';
import { RegisterComponent} from './auth/register/register.component';
import { BoardComponent } from './board/board.component';
import { LoggedInGuard } from './auth/logged-in.guard';
import { LoggedOutGuard } from './auth/logged-out.guard';

const routes: Routes = [
  { path: 'login', component: LoginComponent, canActivate: [LoggedOutGuard] },
  { path: 'register', component: RegisterComponent, canActivate: [LoggedOutGuard] },
  { path: 'board', component: BoardComponent, canActivate: [LoggedInGuard] }
];

@NgModule({
  exports: [ RouterModule ],
  imports: [ RouterModule.forRoot(routes) ]
})

export class RoutingModule {}
