import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BigLeaderboardComponent } from './big-leaderboard.component';

describe('BigLeaderboardComponent', () => {
  let component: BigLeaderboardComponent;
  let fixture: ComponentFixture<BigLeaderboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BigLeaderboardComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(BigLeaderboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
