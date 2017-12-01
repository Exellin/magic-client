import { TestBed, inject } from '@angular/core/testing';
import { HttpModule } from '@angular/http';

import { ProfileService } from './profile.service';

describe('ProfileService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpModule
      ],
      providers: [
        ProfileService
      ]
    });
  });

  it('should be created', inject([ProfileService], (service: ProfileService) => {
    expect(service).toBeTruthy();
  }));
});
