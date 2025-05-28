import { Injectable } from '@angular/core';
import { BehaviorSubject, interval, Subscription } from 'rxjs';
import { map, takeWhile } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class BirdService {
  private birdsSubject = new BehaviorSubject<{ id: number; health: number }[]>(
    [],
  );
  private birdGenerationSubscription: Subscription | null = null;
  private nextId = 0;
  private isPaused = false;

  public birds$ = this.birdsSubject.asObservable();

  constructor() {}

  startBirdGeneration(
    getElapsedTime: () => number,
    getDifficulty: () => number,
  ): void {
    const minDelay = 600;
    const maxDelay = 1000;

    this.birdGenerationSubscription = interval(minDelay)
      .pipe(
        map(() => {
          const speedUp = Math.max(minDelay, maxDelay - getElapsedTime() * 10);
          const difficulty = getDifficulty();
          return { id: this.generateId(), health: difficulty, delay: speedUp };
        }),
        takeWhile(() => !this.isPaused),
      )
      .subscribe((newBird) => {
        const currentBirds = this.birdsSubject.value;
        this.birdsSubject.next([...currentBirds, newBird]);
      });
  }

  private clearBirdGeneration(): void {
    if (this.birdGenerationSubscription) {
      this.birdGenerationSubscription.unsubscribe();
      this.birdGenerationSubscription = null;
    }
  }

  stopBirdGeneration(): void {
    this.clearBirdGeneration();
    this.birdsSubject.next([]);
  }

  pause(): void {
    this.isPaused = true;
    this.clearBirdGeneration();
  }

  resume(getElapsedTime: () => number, getDifficulty: () => number): void {
    if (this.isPaused) {
      this.isPaused = false;
      this.startBirdGeneration(getElapsedTime, getDifficulty);
    }
  }

  removeBird(id: number): void {
    const currentBirds = this.birdsSubject.value;
    const updatedBirds = currentBirds.filter((bird) => bird.id !== id);
    this.birdsSubject.next(updatedBirds);
  }

  private generateId(): number {
    return this.nextId++;
  }
}
