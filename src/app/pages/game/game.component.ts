import {
  Component,
  OnDestroy,
  Inject,
  PLATFORM_ID,
  ViewChild,
  ViewChildren,
  QueryList,
  HostListener,
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { CommonModule } from '@angular/common';
import { BirdComponent } from '../../components/targets/bird/bird.component';
import { HealthComponent } from '../../components/interactive/health/health.component';
import { PlayerService } from '../../services/player.service';
import { BigLeaderboardComponent } from '../../components/interactive/big-leaderboard/big-leaderboard.component';
import { GameStatsService } from '../../services/game-stats.service';
import { PauseTabComponent } from '../../components/interactive/pause-tab/pause-tab.component';

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
export class GameComponent implements OnDestroy {
  @ViewChild(HealthComponent) private healthComponent!: HealthComponent;
  @ViewChildren(BirdComponent)
  private birdComponents!: QueryList<BirdComponent>;

  public birds: { id: number }[] = [];
  public showLeaderboard = false;
  public showPauseTab = false;
  public stopClicks = false;

  private birdTimeout: ReturnType<typeof setTimeout> | null = null;
  private nextId = 0;
  private birdsLost = 0;
  private difficulty = 1;

  constructor(
    @Inject(PLATFORM_ID) private platformId: object,
    public playerService: PlayerService,
    public statsService: GameStatsService,
  ) {
    if (isPlatformBrowser(this.platformId)) {
      this.startBirdGeneration();
      this.startTimer();
    }
  }

  ngOnInit(): void {
    this.playerService.resetStats();
    this.birdsLost = 0;
    this.showLeaderboard = false;
    this.showPauseTab = false;
    this.nextId = 1;
    this.difficulty = this.playerService.getDifficulty();
  }

  ngOnDestroy(): void {
    if (this.birdTimeout) {
      clearTimeout(this.birdTimeout);
    }
    if (this.playerService.getTimer()) {
      this.playerService.stopTimer();
    }
  }

  private startBirdGeneration(): void {
    this.spawnBird();
  }

  private spawnBird(): void {
    const minDelay = 600;
    const maxDelay = 1000;
    const speedUp = Math.max(
      minDelay,
      maxDelay - this.playerService.getTimeElapsed() * 10,
    );

    if (!this.showPauseTab) {
      const newBird = { id: this.nextId++ };
      this.birds.push(newBird);

      // Llama a setDifficulty en el nuevo pájaro
      setTimeout(() => {
        const birdComponent = this.birdComponents.find(
          (bird) => bird.getId === newBird.id,
        );
        if (birdComponent) {
          this.difficulty = this.playerService.getDifficulty();
          birdComponent.setMaxHealth(this.difficulty);
        }
      });
    }

    this.birdTimeout = setTimeout(() => this.spawnBird(), speedUp);
  }

  private startTimer(): void {
    this.playerService.startTimer();
  }

  private stopGame(): void {
    if (this.birdTimeout) {
      clearTimeout(this.birdTimeout);
      this.birdTimeout = null;
    }
    this.birds = [];
    this.playerService.stopTimer();

    this.statsService.setNewGameStats(
      this.playerService.getBirdsDestroyed(),
      this.playerService.getTimeElapsed(),
    );
  }

  public onBirdDestroyed(event: { id: number; byClick: boolean }): void {
    const { id, byClick } = event;

    if (byClick) {
      this.playerService.incrementBirdsDestroyed();
    } else {
      this.birdsLost++;
      this.healthComponent.damage();
    }

    this.birds = this.birds.filter((bird) => bird.id !== id);

    if (this.birdsLost >= 6) {
      this.stopGame();
      this.showLeaderboard = true;
    }
  }

  public onBirdDestroyedByClick(id: number): void {
    const birdComponent = this.birdComponents.find((bird) => bird.getId === id);
    if (birdComponent) {
      //birdComponent.triggerExplosion();
      this.playerService.incrementBirdsDestroyed();
      this.birds = this.birds.filter((bird) => bird.id !== id);
    }
  }

  @HostListener('document:keydown', ['$event'])
  handleKeyDown(event: KeyboardEvent): void {
    if (event.key === 'Escape') {
      this.togglePauseTab();
    }
  }

  private togglePauseTab(): void {
    this.showPauseTab = !this.showPauseTab;

    this.birdComponents.forEach((birdComponent) => {
      if (this.showPauseTab) {
        birdComponent.stopMovement();
        this.playerService.pauseTimer();
        this.preventClicks();
      } else {
        birdComponent.resumeMovement();
        this.playerService.resumeTimer();
        this.resumeClicks();
      }
    });
  }

  private preventClicks(): void {
    this.stopClicks = true;
  }
  private resumeClicks(): void {
    this.stopClicks = false;
  }
}
