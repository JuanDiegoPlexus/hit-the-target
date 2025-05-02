import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-leaderboard',
  standalone: true,
  templateUrl: './leaderboard.component.html',
  styleUrls: ['./leaderboard.component.css'],
  imports: []
})
export class LeaderboardComponent {
  constructor(private router: Router) {}

  irAWelcome() {
    this.router.navigate(['/']);
  }

  animarYRedirigir(cuerdaClase: string, ruta: string) {
    const cuerda = document.querySelector('.' + cuerdaClase);
    const logo = document.querySelector('.logo');
    const leaderboard = document.querySelector('.leaderboard'); // aquí va fija
  
    if (leaderboard) {
      leaderboard.classList.remove('caida');
      void (leaderboard as HTMLElement).offsetWidth;
      leaderboard.classList.add('caida');
    }
  
    if (cuerda) {
      cuerda.classList.remove('rebote');
      void (cuerda as HTMLElement).offsetWidth;
      cuerda.classList.add('rebote');
    }
  
    if (logo) {
      logo.classList.add('logo-bajar');
    }
  
    setTimeout(() => {
      this.router.navigate([ruta]);
    }, 400);
  }
  
  
}

