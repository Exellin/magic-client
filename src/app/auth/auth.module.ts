import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { NgxErrorsModule } from '@ultimate/ngxerrors';

import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { AuthService } from './auth.service';
import { LoggedInGuard } from './logged-in.guard';
import { LoggedOutGuard } from './logged-out.guard';
import { NavbarModule } from '../navbar/navbar.module';

@NgModule({
  declarations: [
    LoginComponent,
    RegisterComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    NgxErrorsModule,
    NavbarModule
  ],
  providers: [
    AuthService,
    LoggedInGuard,
    LoggedOutGuard
  ]
})

export class AuthModule {}
