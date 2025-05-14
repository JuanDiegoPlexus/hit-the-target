import { Component, inject, Input } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-big-leaderboard',
  standalone: true,
  imports: [],
  templateUrl: './big-leaderboard.component.html',
  styleUrl: './big-leaderboard.component.scss',
})
export class BigLeaderboardComponent {
  private router = inject(Router);
  @Input() public playerName = '';
  @Input() public birdsDestroyed = 0;
  @Input() public timeSurvived = 0;

  public goHome(): void {
    this.router.navigate(['/']);
  }
}
