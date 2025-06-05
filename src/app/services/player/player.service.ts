import { Injectable } from '@angular/core'
import { TimerService } from '../game/timer.service'

@Injectable()
export class PlayerService {
  private playerName: string = 'JuanDi'
  private birdsDestroyed: number = 0
  private difficulty: number = 1

  constructor(private timerService: TimerService) {}

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

  public setDifficulty(difficulty: number): void {
    this.difficulty = difficulty
  }

  public getDifficulty(): number {
    const elapsedTime = this.timerService.getTimeElapsed()
    return Math.floor(elapsedTime / 10) + 1
  }
}
