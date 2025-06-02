import { Injectable } from '@angular/core'

@Injectable()
export class PlayerService {
  private playerName: string = 'JuanDi'
  private birdsDestroyed: number = 0
  private coinsEarned: number = 0
  private difficulty: number = 1

  private timeElapsed = 0
  private timeInterval: number | NodeJS.Timeout | null = null

  public setPlayerName(name: string): void {
    this.playerName = name
  }

  public getPlayerName(): string {
    return this.playerName
  }

  public incrementBirdsDestroyed(): void {
    this.birdsDestroyed++
  }

  public getBirdsDestroyed(): number {
    return this.birdsDestroyed
  }

  public resetStats(): void {
    this.birdsDestroyed = 0
    this.setDifficulty(1)
  }

  public startTimer(): void {
    this.timeInterval = setInterval(() => {
      this.timeElapsed++
      if (this.timeElapsed % 10 == 0) {
        this.setDifficulty(this.getDifficulty() * 2)
      }
    }, 1000)
  }

  public resumeTimer(): void {
    if (this.timeInterval === null) {
      this.timeInterval = setInterval(() => {
        this.timeElapsed++
      }, 1000)
    }
  }

  public stopTimer(): void {
    if (this.timeInterval !== null) {
      clearInterval(this.timeInterval as number)
    }
  }

  public pauseTimer(): void {
    if (this.timeInterval !== null) {
      clearInterval(this.timeInterval as number)
      this.timeInterval = null
    }
  }

  public getTimer(): number | NodeJS.Timeout | null {
    return this.timeInterval
  }

  public getTimeElapsed(): number {
    return this.timeElapsed
  }

  public resetTimeElapsed(): void {
    this.timeElapsed = 0
  }

  public incrementCoinsEarned(amount: number): void {
    this.coinsEarned += amount
  }
  public getCoinsEarned(): number {
    return this.coinsEarned
  }

  public setDifficulty(difficulty: number): void {
    this.difficulty = difficulty
  }

  public getDifficulty(): number {
    const elapsedTime = this.getTimeElapsed()
    return Math.floor(elapsedTime / 10) + 1
  }
}
