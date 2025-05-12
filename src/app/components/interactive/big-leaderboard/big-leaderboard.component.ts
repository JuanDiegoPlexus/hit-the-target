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
  @Input() playerName = '';
  @Input() birdsDestroyed = 0;
  @Input() timeSurvived = 0;

  goHome() {
    this.router.navigate(['/']);
  }
}
