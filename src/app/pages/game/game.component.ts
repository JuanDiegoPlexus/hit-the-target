import {
  Component,
  OnDestroy,
  Inject,
  PLATFORM_ID,
  ViewChild,
  HostListener,
  OnInit,
  inject,
} from '@angular/core'
import { isPlatformBrowser } from '@angular/common'
import { CommonModule } from '@angular/common'
import { BirdComponent } from '../../components/targets/bird/bird.component'
import { HealthComponent } from '../../components/interactive/health/health.component'
import { PlayerService } from '../../services/player.service'
import { BigLeaderboardComponent } from '../../components/interactive/big-leaderboard/big-leaderboard.component'
import { GameStatsService } from '../../services/game-stats.service'
import { PauseTabComponent } from '../../components/interactive/pause-tab/pause-tab.component'
import { Subscription } from 'rxjs'
import { BirdService } from '../../services/bird.service'
import { Router } from '@angular/router'
import { DamageAnimationService } from '../../services/damage-animation.service'
@Component({
  selector: 'app-game',
  standalone: true,
  imports: [
    BirdComponent,
    CommonModule,
    HealthComponent,
    BigLeaderboardComponent,
    PauseTabComponent,
  ],
  providers: [PlayerService],
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.scss'],
})
export class GameComponent implements OnInit, OnDestroy {
  @ViewChild(HealthComponent) private healthComponent!: HealthComponent

  public birds: { id: number; health: number; element: HTMLElement | null }[] = []
  private birdSubscription: Subscription | null = null

  public showLeaderboard = false
  public showPauseTab = false
  public stopClicks = false

  private birdTimeout: ReturnType<typeof setTimeout> | null = null
  private birdsLost = 0

  private router = inject(Router)

  constructor(
    @Inject(PLATFORM_ID) private platformId: object,
    private damageAnimationService: DamageAnimationService,
    private birdService: BirdService,
    public playerService: PlayerService,
    public statsService: GameStatsService,
  ) {}

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.startTimer()
    }
    this.playerService.resetStats()

    this.birdSubscription = this.birdService.birds$.subscribe((birds) => {
      this.birds = birds
    })

    this.birdService.startBirdGeneration(
      () => this.playerService.getTimeElapsed(),
      () => this.playerService.getDifficulty(),
    )
  }

  ngOnDestroy(): void {
    if (this.birdSubscription) {
      this.birdSubscription.unsubscribe()
    }
    this.birdService.stopBirdGeneration()
  }

  private startTimer(): void {
    this.playerService.startTimer()
  }

  @HostListener('document:keydown', ['$event'])
  handleKeyDown(event: KeyboardEvent): void {
    if (event.key === 'Escape') {
      this.togglePauseTab()
    }
  }

  private togglePauseTab(): void {
    if (!this.showLeaderboard) {
      this.showPauseTab = !this.showPauseTab

      if (this.showPauseTab) {
        this.pauseGame()
      } else {
        this.resumeGame()
      }
    }
  }

  private pauseGame(): void {
    this.birdService.pause()
    this.playerService.pauseTimer()
  }

  private resumeGame(): void {
    this.birdService.resume(
      () => this.playerService.getTimeElapsed(),
      () => this.playerService.getDifficulty(),
    )
    this.playerService.resumeTimer()
  }

  public stopGame(): void {
    if (this.birdTimeout) {
      clearTimeout(this.birdTimeout)
      this.birdTimeout = null
    }

    this.birdService.stopBirdGeneration()
    this.playerService.stopTimer()

    this.statsService.setNewGameStats(
      this.playerService.getBirdsDestroyed(),
      this.playerService.getTimeElapsed(),
    )
  }

  public handleBirdDestroyed(event: { id: number; byClick: boolean }): void {
    const { id, byClick } = event

    if (byClick) {
      this.playerService.incrementBirdsDestroyed()
    } else {
      this.birdsLost++
      this.healthComponent.damage()
    }

    this.birdService.removeBird(id)

    if (this.birdsLost >= 6) {
      this.stopGame()
      this.showLeaderboard = true
    }
  }

  public leaveGame(): void {
    if (this.birdTimeout) {
      clearTimeout(this.birdTimeout)
      this.birdTimeout = null
    }

    this.birdService.resume(
      () => this.playerService.getTimeElapsed(),
      () => this.playerService.getDifficulty(),
    )
    this.birdService.stopBirdGeneration()
    this.playerService.stopTimer()

    this.statsService.setNewGameStats(
      this.playerService.getBirdsDestroyed(),
      this.playerService.getTimeElapsed(),
    )

    this.router.navigate(['/'])
  }
}
