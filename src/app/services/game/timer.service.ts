import { Injectable } from '@angular/core'

@Injectable({
  providedIn: 'root',
})
export class TimerService {
  private timeElapsed = 0
  private startTime: number | null = null
  private animationFrameId: number | null = null

  public startTimer(): void {
    if (typeof window !== 'undefined' && this.animationFrameId === null) {
      this.startTime = performance.now()
      this.updateTimer()
    }
  }

  private updateTimer(): void {
    this.animationFrameId = requestAnimationFrame((timestamp) => {
      if (this.startTime !== null) {
        const elapsedMilliseconds = timestamp - this.startTime
        this.timeElapsed = Math.floor(elapsedMilliseconds / 1000)
        this.updateTimer()
      }
    })
  }

  public pauseTimer(): void {
    if (this.animationFrameId !== null) {
      cancelAnimationFrame(this.animationFrameId)
      this.animationFrameId = null
    }
  }

  public stopTimer(): void {
    this.pauseTimer()
    this.startTime = null
  }

  public resetTimer(): void {
    this.timeElapsed = 0
  }

  public resumeTimer(): void {
    if (typeof window !== 'undefined' && this.animationFrameId === null) {
      this.startTime = performance.now() - this.timeElapsed * 1000
      this.updateTimer()
    }
  }

  public getTimeElapsed(): number {
    return this.timeElapsed
  }
}
