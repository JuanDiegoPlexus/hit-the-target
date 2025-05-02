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

  animationAndRedirection(ropeClass: string, route: string) {
    const rope = document.querySelector('.' + ropeClass);
    const logo = document.querySelector('.logo');
    const leaderboard = document.querySelector('.leaderboard');
  
    if (leaderboard) {
      leaderboard.classList.remove('leaderboardFall');
      void (leaderboard as HTMLElement).offsetWidth;
      leaderboard.classList.add('leaderboardFall');
    }
  
    if (rope) {
      rope.classList.remove('bounce');
      void (rope as HTMLElement).offsetWidth;
      rope.classList.add('bounce');
    }
  
    if (logo) {
      logo.classList.add('logo-down');
    }
  
    setTimeout(() => {
      this.router.navigate([route]);
    }, 400);
  }
  
  
}

