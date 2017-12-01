import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpModule } from '@angular/http';
import { NgxErrorsModule } from '@ultimate/ngxerrors';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';

import { AuthService } from '../auth/auth.service';
import { DecksListComponent } from '../decks/decks-list/decks-list.component';
import { NavbarComponent } from '../navbar/navbar.component';
import { ProfileComponent } from './profile.component';
import { ProfileService } from './profile.service';

describe('ProfileComponent', () => {
  let component: ProfileComponent;
  let fixture: ComponentFixture<ProfileComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        DecksListComponent,
        NavbarComponent,
        ProfileComponent
      ],
      imports: [
        HttpModule,
        NgxErrorsModule,
        ReactiveFormsModule,
        RouterTestingModule
      ],
      providers: [
        AuthService,
        ProfileService
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProfileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
