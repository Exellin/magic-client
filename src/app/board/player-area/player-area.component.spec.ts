import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MaterializeModule } from 'angular2-materialize';

import { PlayerAreaComponent } from './player-area.component';
import { MaterializeDirective } from 'angular2-materialize/dist/materialize-directive';

describe('PlayerAreaComponent', () => {
  let component: PlayerAreaComponent;
  let fixture: ComponentFixture<PlayerAreaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        PlayerAreaComponent
      ],
      imports: [
        MaterializeModule
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PlayerAreaComponent);
    component = fixture.componentInstance;
    component.player = {
      deck: {
        name: ''
      },
      library: []
    };
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
