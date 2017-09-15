import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { JwtHelper, tokenNotExpired } from 'angular2-jwt';
import 'rxjs/add/operator/map';
import { Subject, BehaviorSubject } from 'rxjs/Rx';

@Injectable()

export class AuthService {
  private headers = new Headers({ 'Content-Type': 'application/json' });
  private options = new RequestOptions({ headers: this.headers });

  jwtHelper: JwtHelper = new JwtHelper();

  currentUser$: Subject<any> = new BehaviorSubject<any>({});

  constructor(private http: Http) {
    this.setCurrentUser();
  }

  emit(value) {
    this.currentUser$.next(value);
  }

  get currentUser(): BehaviorSubject<any> {
    return this.currentUser$ as BehaviorSubject<any>;
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
    this.setCurrentUser();
  }

  setCurrentUser() {
    const token = localStorage.getItem('token');
    if (token) {
      this.emit(this.jwtHelper.decodeToken(token).user);
    } else {
      this.emit('');
    }
  }
}
