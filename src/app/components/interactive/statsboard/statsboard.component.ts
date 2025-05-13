import { Component, ElementRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common'; // <-- Importa esto
import { GameStatsService } from '../../../services/game-stats.service';

@Component({
  selector: 'app-statsboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './statsboard.component.html',
  styleUrl: './statsboard.component.scss',
})
export class StatsboardComponent {
  @ViewChild('statsboardElement')
  statsboardElement!: ElementRef<HTMLDivElement>;

  constructor(public statsService: GameStatsService) {}

  get gameHistory() {
    return this.statsService.gameHistory;
  }

  get bestScore() {
    return this.statsService.bestScore;
  }

  statsboardFall(): void {
    const statsboard = this.statsboardElement.nativeElement;
    statsboard.classList.remove('statsboardFall');
    void (statsboard as HTMLElement).offsetWidth;
    statsboard.classList.add('statsboardFall');
  }
}
