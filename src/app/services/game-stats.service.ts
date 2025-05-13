import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class GameStatsService {
  constructor() {}

  private _gameHistory: { birdsDestroyed: number; timeElapsed: number }[] = [];
  private totalTimePLayed = 0;
  private gamesPlayed = 0;
  private totalBirdsDestroyed = 0;
  private _bestScore = 0;
  private _bestTime = 0;

  setNewGameStats(birdsDestroyed: number, timeElapsed: number) {
    this.gamesPlayed++;
    this.totalTimePLayed += timeElapsed;
    this.totalBirdsDestroyed += birdsDestroyed;

    this._gameHistory.push({
      birdsDestroyed,
      timeElapsed,
    });

    this._bestScore = Math.max(this._bestScore, birdsDestroyed);
    this._bestTime = Math.max(this._bestTime, timeElapsed);
  }

  get bestScore() {
    return this._bestScore;
  }
  get bestTime() {
    return this._bestTime;
  }
  get gameHistory() {
    return this._gameHistory;
  }
}
