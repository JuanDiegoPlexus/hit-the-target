import { isPlatformBrowser } from '@angular/common'
import { Inject, Injectable, PLATFORM_ID } from '@angular/core'
import { BehaviorSubject, interval, Subscription } from 'rxjs'
import { map, takeWhile } from 'rxjs/operators'

@Injectable({
  providedIn: 'root',
})
export class BirdService {
  private birdsSubject = new BehaviorSubject<
    { id: number; health: number; element: HTMLElement | null }[]
  >([])
  private birdGenerationSubscription: Subscription | null = null
  private nextId = 0
  private isPaused = false

  public birds$ = this.birdsSubject.asObservable()
  constructor(@Inject(PLATFORM_ID) private platformId: object) {}

  private generateId(): number {
    return this.nextId++
  }

  private clearBirdGeneration(): void {
    if (this.birdGenerationSubscription) {
      this.birdGenerationSubscription.unsubscribe()
      this.birdGenerationSubscription = null
    }
  }

  startBirdGeneration(getElapsedTime: () => number, getDifficulty: () => number): void {
    if (isPlatformBrowser(this.platformId)) {
      const minDelay = 600
      const maxDelay = 1000

      this.birdGenerationSubscription = interval(minDelay)
        .pipe(
          map(() => {
            const speedUp = Math.max(minDelay, maxDelay - getElapsedTime() * 10)
            const difficulty = getDifficulty()
            return { id: this.generateId(), health: difficulty, delay: speedUp, element: null }
          }),
          takeWhile(() => !this.isPaused),
        )
        .subscribe((newBird) => {
          const currentBirds = this.birdsSubject.value
          this.birdsSubject.next([...currentBirds, newBird])
        })
    }
  }

  public stopBirdGeneration(): void {
    this.clearBirdGeneration()
    this.birdsSubject.next([])
    this.nextId = 0
  }

  public pause(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.isPaused = true
      this.clearBirdGeneration()
    }
  }

  public resume(getElapsedTime: () => number, getDifficulty: () => number): void {
    if (isPlatformBrowser(this.platformId) && this.isPaused) {
      this.isPaused = false
      this.startBirdGeneration(getElapsedTime, getDifficulty)
    }
  }

  public removeBird(id: number): void {
    const currentBirds = this.birdsSubject.value
    const updatedBirds = currentBirds.filter((bird) => bird.id !== id)
    this.birdsSubject.next(updatedBirds)
  }
}
