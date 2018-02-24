import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions } from '@angular/http';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';

@Injectable()

export class CardsService {
  constructor(
    private http: Http,
    private httpClient: HttpClient
  ) {}

  setHeaders(): RequestOptions {
    const headers: Headers = new Headers();
    headers.append('Content_Type', 'application/json');
    headers.append('Authorization', localStorage.getItem('token'));
    const options = new RequestOptions({ headers: headers });
    return options;
  }

  setScryFallHeaders(): Object {
    const headers: HttpHeaders = new HttpHeaders({
      'Content-Type': 'text/plain',
    });
    const options = { headers: headers };
    return options;
  }

  getCardFromApi(cardName): Observable<any> {
    return this.http.get(`https://api.magicthegathering.io/v1/cards?name="${cardName}"&contains=multiverseid&pageSize=2`).map(
      res => res.json());
  }

  getCardFromDatabase(cardName): Observable<any> {
    return this.http.get(`api/cards/${cardName}`, this.setHeaders()).map(res => res.json());
  }

  saveCard(card): Observable<any> {
    return this.http.post('api/card', card, this.setHeaders()).map(res => res.json());
  }

  getSetFromApi(set): Observable<any> {
    return this.httpClient.get(`https://api.scryfall.com/sets/${set}`, this.setScryFallHeaders());
  }

  getCardsInSet(search_uri): Observable<any> {
    return this.httpClient.get(search_uri, this.setScryFallHeaders());
  }
}
