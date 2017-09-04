import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, FormControl, FormBuilder } from '@angular/forms';
import { toast } from 'angular2-materialize';

import { AuthService } from '../auth.service';

@Component({
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})

export class LoginComponent implements OnInit {
  loginForm: FormGroup;

  email = new FormControl('');
  password = new FormControl('');

  constructor(
    private FormBuilder: FormBuilder,
    private router: Router,
    private authService: AuthService) {}

  ngOnInit() {
    this.loginForm = this.FormBuilder.group({
      email: this.email,
      password: this.password
    });
  }

  loginSubmit() {
    this.authService.login(this.loginForm.value).subscribe(
      res => {
        this.authService.storeToken(res.token);
        this.authService.setCurrentUserFromToken(res.token);
        toast('Logged in successfully', 5000);
        this.router.navigate(['/']);
      },
      err => {
        toast('Invalid username or password', 5000);
      }
    );
  }
}
