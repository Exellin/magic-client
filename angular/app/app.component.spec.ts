import { TestBed, async } from '@angular/core/testing';
import { HttpModule } from '@angular/http';
import { RouterTestingModule } from '@angular/router/testing';

import { AppComponent } from './app.component';
import { BoardComponent } from './board/board.component';
import { CardsService } from './cards/cards.service';
import { NavbarComponent } from './navbar/navbar.component';
import { AuthModule } from './auth/auth.module';

describe('AppComponent', () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        AppComponent,
        BoardComponent,
        NavbarComponent
      ],
      imports: [
        AuthModule,
        HttpModule,
        RouterTestingModule
      ],
      providers: [CardsService]
    }).compileComponents();
  }));

  it('should create the app', async(() => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.debugElement.componentInstance;
    expect(app).toBeTruthy();
  }));
});
