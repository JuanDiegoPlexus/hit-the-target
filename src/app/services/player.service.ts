/* eslint-disable @typescript-eslint/no-explicit-any */
import { Injectable } from '@angular/core';

@Injectable()
export class PlayerService {
  private playerName: string = 'JuanDi';
  private birdsDestroyed: number = 0;

  private timeElapsed = 0;
  private timeInterval: any;

  public setPlayerName(name: string): void {
    this.playerName = name;
  }

  public getPlayerName(): string {
    return this.playerName;
  }

  public incrementBirdsDestroyed(): void {
    this.birdsDestroyed++;
  }

  public getBirdsDestroyed(): number {
    return this.birdsDestroyed;
  }

  public resetStats(): void {
    this.birdsDestroyed = 0;
  }

  public startTimer(): void {
    this.timeInterval = setInterval(() => {
      this.timeElapsed++;
    }, 1000);
  }
  public stopTimer(): void {
    clearInterval(this.timeInterval);
  }

  public getTimer(): any {
    return this.timeInterval;
  }

  public getTimeElapsed(): number {
    return this.timeElapsed;
  }

  public resetTimeElapsed(): void {
    this.timeElapsed = 0;
  }
}
