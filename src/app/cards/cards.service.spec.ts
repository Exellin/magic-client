import { TestBed, inject } from '@angular/core/testing';
import { HttpModule } from '@angular/http';

import { CardsService } from './cards.service';

describe('CardsService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpModule
      ],
      providers: [
        CardsService
      ]
    });
  });

  it('should be created', inject([CardsService], (service: CardsService) => {
    expect(service).toBeTruthy();
  }));
});
