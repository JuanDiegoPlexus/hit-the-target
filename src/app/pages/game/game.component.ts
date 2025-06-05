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
import { PlayerService } from '../../services/player/player.service'
import { BigLeaderboardComponent } from '../../components/interactive/big-leaderboard/big-leaderboard.component'
import { GameStatsService } from '../../services/game/game-stats.service'
import { PauseTabComponent } from '../../components/interactive/pause-tab/pause-tab.component'
import { Subject, Subscription } from 'rxjs'
import { BirdService } from '../../services/bird/bird.service'
import { Router } from '@angular/router'
import { DamageAnimationService } from '../../services/bird/damage-animation.service'
import { VisibilityService } from '../../services/game/visibility.service'
import { ShopTabComponent } from '../../components/interactive/shop-tab/shop-tab.component'
import { TimerService } from '../../services/game/timer.service'
@Component({
  selector: 'app-game',
  standalone: true,
  imports: [
    BirdComponent,
    CommonModule,
    HealthComponent,
    BigLeaderboardComponent,
    PauseTabComponent,
    ShopTabComponent,
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
  public showShopTab = false
  public stopClicks = false

  private birdTimeout: ReturnType<typeof setTimeout> | null = null
  private birdsLost = 0
  private destroy$ = new Subject<void>()
  private router = inject(Router)

  constructor(
    @Inject(PLATFORM_ID) private platformId: object,
    private damageAnimationService: DamageAnimationService,
    private birdService: BirdService,
    private statsService: GameStatsService,
    private visibilityService: VisibilityService,
    public timerService: TimerService,
    public playerService: PlayerService,
  ) {}

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.startTimer()
      this.updateVh()
      window.addEventListener('resize', this.updateVh)

      this.birdSubscription = this.birdService.birds$.subscribe((birds) => {
        this.birds = birds
      })

      this.playerService.resetStats()
      this.timerService.resetTimer()
      this.birdService.startBirdGeneration(
        () => this.timerService.getTimeElapsed(),
        () => this.playerService.getDifficulty(),
      )

      this.visibilityService.visibility$.subscribe((isVisible) => {
        if (!isVisible) {
          this.showPauseTab = true
          this.pauseGame()
        }
      })
    }
  }

  ngOnDestroy(): void {
    if (isPlatformBrowser(this.platformId)) {
      window.removeEventListener('resize', this.updateVh)
    }

    if (this.birdSubscription) {
      this.birdSubscription.unsubscribe()
    }

    this.destroy$.next()
    this.destroy$.complete()

    this.leaveGame()
  }

  private startTimer(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.timerService.startTimer()
    }
  }

  @HostListener('document:keydown', ['$event'])
  handleKeyDown(event: KeyboardEvent): void {
    if (event.key === 'Escape') {
      this.togglePauseTab()
    }
  }

  private updateVh(): void {
    const vh = window.innerHeight * 0.01
    document.documentElement.style.setProperty('--vh', `${vh}px`)
  }

  private pauseGame(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.birdService.pause()
      this.timerService.pauseTimer()
    }
  }

  private resumeGame(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.birdService.resume(
        () => this.timerService.getTimeElapsed(),
        () => this.playerService.getDifficulty(),
      )
      this.timerService.resumeTimer()
    }
  }

  public stopGame(): void {
    if (this.birdTimeout) {
      clearTimeout(this.birdTimeout)
      this.birdTimeout = null
    }

    this.birdService.stopBirdGeneration()
    this.timerService.stopTimer()

    this.statsService.setNewGameStats(
      this.playerService.getBirdsDestroyed(),
      this.timerService.getTimeElapsed(),
    )
  }

  public leaveGame(): void {
    if (this.birdTimeout) {
      clearTimeout(this.birdTimeout)
      this.birdTimeout = null
    }

    this.birdService.resume(
      () => this.timerService.getTimeElapsed(),
      () => this.playerService.getDifficulty(),
    )
    this.birdService.stopBirdGeneration()
    this.timerService.stopTimer()

    this.statsService.setNewGameStats(
      this.playerService.getBirdsDestroyed(),
      this.timerService.getTimeElapsed(),
    )

    this.router.navigate(['/'])
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

  public toggleShopTab(): void {
    if (!this.showLeaderboard && !this.showPauseTab) {
      this.showShopTab = !this.showShopTab

      if (this.showShopTab) {
        this.pauseGame()
      } else {
        this.resumeGame()
      }
    }
  }

  public togglePauseTab(): void {
    if (!this.showLeaderboard && !this.showShopTab) {
      this.showPauseTab = !this.showPauseTab

      if (this.showPauseTab) {
        this.pauseGame()
      } else {
        this.resumeGame()
      }
    }
  }
}
