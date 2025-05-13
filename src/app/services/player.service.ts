/* eslint-disable @typescript-eslint/no-explicit-any */
import { Injectable } from '@angular/core';

@Injectable()
export class PlayerService {
  private playerName: string = 'JuanDi';
  private birdsDestroyed: number = 0;

  private timeElapsed = 0;
  private timeInterval: any;

  setPlayerName(name: string) {
    this.playerName = name;
  }

  getPlayerName(): string {
    return this.playerName;
  }

  incrementBirdsDestroyed() {
    this.birdsDestroyed++;
  }

  getBirdsDestroyed(): number {
    return this.birdsDestroyed;
  }

  resetStats() {
    this.birdsDestroyed = 0;
  }

  startTimer() {
    this.timeInterval = setInterval(() => {
      this.timeElapsed++;
    }, 1000);
  }
  stopTimer() {
    clearInterval(this.timeInterval);
  }

  getTimer() {
    return this.timeInterval;
  }

  getTimeElapsed(): number {
    return this.timeElapsed;
  }

  resetTimeElapsed() {
    this.timeElapsed = 0;
  }
}
