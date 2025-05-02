import { Routes } from '@angular/router';
import { WelcomeComponent } from './welcome/welcome.component';
import { LeaderboardComponent } from './leaderboard/leaderboard.component';
import { StatsComponent } from './stats/stats.component';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./welcome/welcome.component').then(m => m.WelcomeComponent)
  },
  {
    path: 'leaderboard',
    loadComponent: () =>
      import('./leaderboard/leaderboard.component').then(m => m.LeaderboardComponent)
  }
];


