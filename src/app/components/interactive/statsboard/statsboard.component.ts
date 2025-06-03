import { Component, ElementRef, ViewChild } from '@angular/core'
import { CommonModule } from '@angular/common'
import { GameStatsService } from '../../../services/game-stats.service'
import { gsap } from 'gsap'

@Component({
  selector: 'app-statsboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './statsboard.component.html',
  styleUrl: './statsboard.component.scss',
})
export class StatsboardComponent {
  @ViewChild('statsboardElement')
  private statsboardElement!: ElementRef<HTMLDivElement>

  constructor(public statsService: GameStatsService) {}

  public get gameHistory(): { birdsDestroyed: number; timeElapsed: number }[] {
    return this.statsService.gameHistory
  }

  public get bestScore(): number {
    return this.statsService.bestScore
  }

  public statsboardFall(): void {
    const statsboard = this.statsboardElement.nativeElement
    gsap.to(statsboard, {
      y: window.innerHeight,
      opacity: 0,
      duration: 0.8,
      ease: 'ease.in',
      clearProps: 'all',
    })
  }
}
