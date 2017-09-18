import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';

@Injectable()

export class CardsService {
  private token = localStorage.getItem('token');
  private headers = new Headers({ 'Content-Type': 'application/json',
                                  'Authorization': this.token });
  private options = new RequestOptions({ headers: this.headers });

  constructor(private http: Http) {}

  getCardFromApi(cardName): Observable<any> {
    return this.http.get(`https://api.magicthegathering.io/v1/cards?name="${cardName}"&contains=imageUrl&pageSize=1`).map(
      res => res.json());
  }

  getCardFromDatabase(cardName): Observable<any> {
    return this.http.get(`http://localhost:3000/api/cards/${cardName}`, this.options).map(res => res.json());
  }

  saveCard(card): Observable<any> {
    return this.http.post('http://localhost:3000/api/card', card, this.options).map(res => res.json());
  }
}
