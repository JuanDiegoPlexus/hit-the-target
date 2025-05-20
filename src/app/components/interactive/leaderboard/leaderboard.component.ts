import { Component, ElementRef, ViewChild } from '@angular/core';
import { GameStatsService } from '../../../services/game-stats.service';
import { gsap } from 'gsap';

@Component({
  selector: 'app-leaderboard',
  standalone: true,
  imports: [],
  templateUrl: './leaderboard.component.html',
  styleUrl: './leaderboard.component.scss',
})
export class LeaderboardComponent {
  constructor(public statsService: GameStatsService) {}
  @ViewChild('leaderboardElement')
  private leaderboardElement!: ElementRef<HTMLImageElement>;

  public get bestTime(): number {
    return this.statsService.bestTime;
  }

  public get playerName(): string {
    return this.statsService.playerName;
  }

  public leaderboardFall(): void {
    const leaderboard = this.leaderboardElement.nativeElement;
    gsap.to(leaderboard, {
      y: window.innerHeight,
      opacity: 0,
      duration: 0.8,
      ease: 'ease.in',
      clearProps: 'all',
    });
  }
}
