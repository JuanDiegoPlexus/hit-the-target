import { Component, ElementRef, ViewChild } from '@angular/core';

@Component({
  selector: 'app-leaderboard',
  standalone: true,
  imports: [],
  templateUrl: './leaderboard.component.html',
  styleUrl: './leaderboard.component.scss',
})
export class LeaderboardComponent {
  @ViewChild('leaderboardElement')
  leaderboardElement!: ElementRef<HTMLImageElement>;

  leaderboardFall(): void {
    const leaderboard = this.leaderboardElement.nativeElement;
    leaderboard.classList.remove('leaderboardFall');
    void (leaderboard as HTMLElement).offsetWidth;
    leaderboard.classList.add('leaderboardFall');
  }
}
