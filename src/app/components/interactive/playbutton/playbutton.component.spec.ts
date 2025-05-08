import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlaybuttonComponent } from './playbutton.component';

describe('PlaybuttonComponent', () => {
  let component: PlaybuttonComponent;
  let fixture: ComponentFixture<PlaybuttonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PlaybuttonComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(PlaybuttonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
