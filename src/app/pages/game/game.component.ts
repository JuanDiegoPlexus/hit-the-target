/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  Component,
  OnDestroy,
  Inject,
  PLATFORM_ID,
  ViewChild,
  ViewChildren,
  QueryList,
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { CommonModule } from '@angular/common';
import { BirdComponent } from '../../components/targets/bird/bird.component';
import { HealthComponent } from '../../components/interactive/health/health.component';
import { PlayerService } from '../../services/player.service';
import { BigLeaderboardComponent } from '../../components/interactive/big-leaderboard/big-leaderboard.component';
import { GameStatsService } from '../../services/game-stats.service';

@Component({
  selector: 'app-game',
  standalone: true,
  imports: [
    BirdComponent,
    CommonModule,
    HealthComponent,
    BigLeaderboardComponent,
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

  private birdTimeout: any;
  private nextId = 0;
  private birdsLost = 0;

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
    this.birds.push({ id: this.nextId++ });

    const minDelay = 150;
    const maxDelay = 1000;
    const speedUp = Math.max(
      minDelay,
      maxDelay - this.playerService.getTimeElapsed() * 30,
    );

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

  public onBirdDestroyed(id: number): void {
    this.birds = this.birds.filter((bird) => bird.id !== id);
    this.birdsLost++;
    this.healthComponent.damage();
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
}
