import {
  Component,
  OnDestroy,
  Inject,
  PLATFORM_ID,
  ViewChild,
  ViewChildren,
  QueryList,
  inject,
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { CommonModule } from '@angular/common';
import { Bird1Component } from '../../components/targets/bird1/bird1.component';
import { Router } from '@angular/router';
import { HealthComponent } from '../../components/interactive/health/health.component';
import { PlayerService } from '../../services/player.service';
import { BigLeaderboardComponent } from '../../components/interactive/big-leaderboard/big-leaderboard.component';

@Component({
  selector: 'app-game',
  standalone: true,
  imports: [
    Bird1Component,
    CommonModule,
    HealthComponent,
    BigLeaderboardComponent,
  ],
  providers: [PlayerService],
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.scss'],
})
export class GameComponent implements OnDestroy {
  @ViewChild(HealthComponent) healthComponent!: HealthComponent;
  @ViewChildren(Bird1Component) birdComponents!: QueryList<Bird1Component>;

  birds: { id: number }[] = [];
  private birdTimeout: any;
  private nextId = 0;
  private birdsLost = 0;
  public showLeaderboard = false;

  private router = inject(Router);
  constructor(
    @Inject(PLATFORM_ID) private platformId: object,
    public playerService: PlayerService,
  ) {
    if (isPlatformBrowser(this.platformId)) {
      this.startBirdGeneration();
      this.startTimer();
    }
  }

  private startBirdGeneration(): void {
    this.spawnBird();
  }

  private spawnBird(): void {
    this.birds.push({ id: this.nextId++ });

    const minDelay = 250;
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

  onBirdDestroyed(id: number): void {
    this.birds = this.birds.filter((bird) => bird.id !== id);
    this.birdsLost++;
    this.healthComponent.damage();
    if (this.birdsLost >= 6) {
      this.stopGame();
      this.showLeaderboard = true;
    }
  }

  onBirdDestroyedByClick(id: number): void {
    const birdComponent = this.birdComponents.find((bird) => bird.id === id);
    if (birdComponent) {
      birdComponent.triggerExplosion();
      this.playerService.incrementBirdsDestroyed();
    }
    this.birds = this.birds.filter((bird) => bird.id !== id);
  }

  ngOnDestroy(): void {
    if (this.birdTimeout) {
      clearTimeout(this.birdTimeout);
    }
    if (this.playerService.getTimer()) {
      this.playerService.stopTimer();
    }
  }

  stopGame(): void {
    //Stop birds generation
    if (this.birdTimeout) {
      clearTimeout(this.birdTimeout);
      this.birdTimeout = null;
    }
    // Optional
    this.birds = [];
    this.playerService.stopTimer();
  }
}
