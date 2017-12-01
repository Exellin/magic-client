import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpModule } from '@angular/http';
import { NgxErrorsModule } from '@ultimate/ngxerrors';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';

import { AuthService } from '../auth.service';
import { NavbarComponent } from '../../navbar/navbar.component';
import { RegisterComponent } from '../register/register.component';

describe('RegisterComponent', () => {
  let component: RegisterComponent;
  let fixture: ComponentFixture<RegisterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        NavbarComponent,
        RegisterComponent
      ],
      imports: [
        HttpModule,
        NgxErrorsModule,
        ReactiveFormsModule,
        RouterTestingModule
      ],
      providers: [
        AuthService,
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RegisterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
