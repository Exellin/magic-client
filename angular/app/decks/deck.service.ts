import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class DeckService {
  private token = localStorage.getItem('token');
  private headers = new Headers({ 'Content-Type': 'application/json',
                                  'Authorization': this.token });
  private options = new RequestOptions({ headers: this.headers });

  constructor(private http: Http) {}

  createDeck(deck): Observable<any> {
    return this.http.post('http://localhost:3000/api/deck', deck, this.options).map(res => res.json());
  }

  getDeck(deckId): Observable<any> {
    return this.http.get(`http://localhost:3000/api/decks/${deckId}`).map(res => res.json());
  }
}
