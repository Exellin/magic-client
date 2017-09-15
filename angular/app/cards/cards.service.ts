import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';

@Injectable()

export class CardsService {

  constructor(private http: Http) {}

  getCard(cardName) {
    return this.http.get(`https://api.magicthegathering.io/v1/cards?name="${cardName}"&contains=imageUrl`).map(res => res.json());
  }
}
