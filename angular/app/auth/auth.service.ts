import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { JwtHelper, tokenNotExpired } from 'angular2-jwt';
import 'rxjs/add/operator/map';

@Injectable()

export class AuthService {
  private headers = new Headers({ 'Content-Type': 'application/json' });
  private options = new RequestOptions({ headers: this.headers });

  jwtHelper: JwtHelper = new JwtHelper();

  currentUser = { id: '', username: '', email: '' };

  constructor(private http: Http) {
    const token = localStorage.getItem('token');
    if (token) {
      this.setCurrentUserFromToken(token);
    }
  }

  register(user): Observable<any> {
    return this.http.post('http://localhost:3000/api/user', user, this.options).map(res => res.json());
  }

  login(credentials): Observable<any> {
    return this.http.post('http://localhost:3000/api/login', credentials, this.options).map(res => res.json());
  }

  storeToken(token) {
    localStorage.setItem('token', token);
  }

  loggedIn() {
    return tokenNotExpired();
  }

  logout() {
    localStorage.removeItem('token');
    this.currentUser = { id: '', username: '', email: '' };
  }

  setCurrentUserFromToken(token) {
    this.currentUser = this.jwtHelper.decodeToken(token).user;
  }
}
