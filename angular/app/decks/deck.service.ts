import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class DeckService {
  constructor(private http: Http) {}

  setHeaders(): RequestOptions {
    const headers: Headers = new Headers();
    headers.append('Content_Type', 'application/json');
    headers.append('Authorization', localStorage.getItem('token'));
    const options = new RequestOptions({ headers: headers });
    return options;
  }

  createDeck(deck): Observable<any> {
    return this.http.post('http://localhost:3000/api/deck', deck, this.setHeaders()).map(res => res.json());
  }

  getDeck(deckId): Observable<any> {
    return this.http.get(`http://localhost:3000/api/decks/${deckId}`).map(res => res.json());
  }

  updateDeck(deck): Observable<any> {
    return this.http.put(`http://localhost:3000/api/decks/${deck._id}`, deck, this.setHeaders());
  }
}
