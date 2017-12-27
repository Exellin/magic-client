import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';

@Injectable()

export class ProfileService {

  constructor(private http: Http) {}

  getUser(username): Observable<any> {
    return this.http.get(`api/user/${username}`).map(res => res.json());
  }
}
