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

@Component({
  selector: 'app-game',
  standalone: true,
  imports: [Bird1Component, CommonModule, HealthComponent],
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

  timeElapsed = 0; // Contador para el tiempo transcurrido
  private timeInterval: any; // Intervalo para actualizar el tiempo

  private router = inject(Router);
  constructor(@Inject(PLATFORM_ID) private platformId: object) {
    if (isPlatformBrowser(this.platformId)) {
      this.startBirdGeneration();
      this.startTimer(); // Inicia el temporizador
    }
  }

  private startBirdGeneration(): void {
    this.spawnBird();
  }

  private spawnBird(): void {
    this.birds.push({ id: this.nextId++ });

    const minDelay = 250;
    const maxDelay = 1000;
    const speedUp = Math.max(minDelay, maxDelay - this.timeElapsed * 30);

    this.birdTimeout = setTimeout(() => this.spawnBird(), speedUp);
  }

  private startTimer(): void {
    this.timeInterval = setInterval(() => {
      this.timeElapsed++; // Incrementa el contador cada segundo
    }, 1000);
  }

  onBirdDestroyed(id: number): void {
    this.birds = this.birds.filter((bird) => bird.id !== id);
    this.birdsLost++;
    this.healthComponent.damage();
    if (this.birdsLost >= 6) {
      alert('¡Has perdido!');
      alert('¡Has sobrevivido ' + this.timeElapsed + ' segundos!');
      this.router.navigate(['/']);
    }
  }

  onBirdDestroyedByClick(id: number): void {
    const birdComponent = this.birdComponents.find((bird) => bird.id === id);
    if (birdComponent) {
      birdComponent.triggerExplosion();
    }
    this.birds = this.birds.filter((bird) => bird.id !== id);
  }

  ngOnDestroy(): void {
    if (this.birdTimeout) {
      clearTimeout(this.birdTimeout);
    }
    if (this.timeInterval) {
      clearInterval(this.timeInterval); // Limpia el intervalo del temporizador
    }
  }
}
