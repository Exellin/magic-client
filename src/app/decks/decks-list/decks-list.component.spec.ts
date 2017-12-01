import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpModule } from '@angular/http';
import { NgxErrorsModule } from '@ultimate/ngxerrors';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';

import { DecksListComponent } from './decks-list.component';
import { DeckService } from '../deck.service';

describe('DecksListComponent', () => {
  let component: DecksListComponent;
  let fixture: ComponentFixture<DecksListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        DecksListComponent
      ],
      imports: [
        HttpModule,
        NgxErrorsModule,
        ReactiveFormsModule,
        RouterTestingModule
      ],
      providers: [
        DeckService
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DecksListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
