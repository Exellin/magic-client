import { TestBed, inject } from '@angular/core/testing';
import { HttpModule } from '@angular/http';

import { DeckService } from './deck.service';

describe('DeckService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpModule
      ],
      providers: [
        DeckService
      ]
    });
  });

  it('should be created', inject([DeckService], (service: DeckService) => {
    expect(service).toBeTruthy();
  }));
});
