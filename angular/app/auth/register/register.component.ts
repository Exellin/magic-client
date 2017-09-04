import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { toast } from 'angular2-materialize';

import { AuthService } from '../auth.service';

@Component({
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})

export class RegisterComponent implements OnInit {
  registerForm: FormGroup;

  requiredError = {name: 'required', text: 'This field is required', rules: ['touched']};

  usernameErrors = [
    this.requiredError,
    {name: 'minlength', text: 'Min length is 2', rules: ['touched']},
    {name: 'maxlength', text: 'Max length is 30', rules: ['touched']},
    {name: 'pattern', text: 'Can only contain numbers, letters, dashes, and underscores', rules: ['touched']}
  ];

  emailErrors = [
    this.requiredError,
    {name: 'email', text: 'Please enter a valid email', rules: ['touched']}
  ];

  passwordErrors = [
    this.requiredError,
    {name: 'minlength', text: 'Min length is 6', rules: ['touched']}
  ];

  username = new FormControl('', [Validators.required,
                                  Validators.minLength(2),
                                  Validators.maxLength(30),
                                  Validators.pattern('[a-zA-Z0-9_-\\s]*')]);

  email = new FormControl('', [Validators.required,
                               Validators.email]);

  password = new FormControl('', [Validators.required,
                                  Validators.minLength(6)]);

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private authService: AuthService) {}

  ngOnInit() {
    this.registerForm = this.formBuilder.group({
      username: this.username,
      email: this.email,
      password: this.password
    });
  }

  setClass(field) {
    return { 'invalid': this[field].touched && !this[field].valid };
  }

  registerSubmit() {
    this.authService.register(this.registerForm.value).subscribe(
      res => {
        toast('You successfully registered and can log in', 5000);
        this.router.navigate(['/login']);
      },
      err => {
        toast(JSON.parse(err._body).error, 5000);
      }
    );
  }
}
