import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';

@Injectable()

export class AuthService {

  private headers = new Headers({'Content-Type': 'application/json'});

  constructor(private http: Http) {}

  register(user): Observable<any> {
    return this.http.post('http://localhost:3000/api/user', user, {headers: this.headers}).map(res => res.json());
  }
}
