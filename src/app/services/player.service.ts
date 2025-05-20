import { Injectable } from '@angular/core';

@Injectable()
export class PlayerService {
  private playerName: string = 'JuanDi';
  private birdsDestroyed: number = 0;

  private timeElapsed = 0;
  private timeInterval: number | NodeJS.Timeout | null = null;

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
    if (this.timeInterval !== null) {
      clearInterval(this.timeInterval as number);
    }
  }

  public getTimer(): number | NodeJS.Timeout | null {
    return this.timeInterval;
  }

  public getTimeElapsed(): number {
    return this.timeElapsed;
  }

  public resetTimeElapsed(): void {
    this.timeElapsed = 0;
  }
}
