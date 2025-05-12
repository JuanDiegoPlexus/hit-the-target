import { Injectable } from '@angular/core';

@Injectable()
export class PlayerService {
  playerName: string = '';
  birdsDestroyed: number = 0;
  timeElapsed = 0; // Contador para el tiempo transcurrido
  private timeInterval: any; // Intervalo para actualizar el tiempo

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
