import { Injectable } from '@angular/core'

@Injectable({
  providedIn: 'root',
})
export class GameStatsService {
  private _playerName = 'JuanDi'
  private _gameHistory: { birdsDestroyed: number; timeElapsed: number }[] = []
  private totalTimePLayed = 0
  private gamesPlayed = 0
  private totalBirdsDestroyed = 0
  private _bestScore = 0
  private _bestTime = 0
  private _totalCoins = 0

  private _damageLevel = 1
  private _damage = 1

  public setNewGameStats(birdsDestroyed: number, timeElapsed: number): void {
    this.gamesPlayed++
    this.totalTimePLayed += timeElapsed
    this.totalBirdsDestroyed += birdsDestroyed

    this._gameHistory.push({
      birdsDestroyed,
      timeElapsed,
    })

    this._bestScore = Math.max(this._bestScore, birdsDestroyed)
    this._bestTime = Math.max(this._bestTime, timeElapsed)
  }

  public addCoins(coins: number): void {
    this._totalCoins += coins
  }

  public get playerName(): string {
    return this._playerName
  }

  public get bestScore(): number {
    return this._bestScore
  }
  public get bestTime(): number {
    return this._bestTime
  }
  public get gameHistory(): { birdsDestroyed: number; timeElapsed: number }[] {
    return this._gameHistory
  }

  public get damageLevel(): number {
    return this._damageLevel
  }

  public get coins(): number {
    return this._totalCoins
  }

  public set damageLevel(level: number) {
    this._damageLevel = level
    this._damage = level * 2
  }

  public canBuy(type: string): boolean {
    let response: boolean = false
    if (type === 'damage') {
      if (this._totalCoins >= 10 * this._damageLevel) {
        this._totalCoins -= 10 * this._damageLevel
        this.damageLevel++
        response = true
      }
    }

    return response
  }
}
