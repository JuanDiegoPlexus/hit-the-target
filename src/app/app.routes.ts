import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    title: 'Hit the Target',
    loadComponent: () =>
      import('./pages/welcome/welcome.component').then(m => m.WelcomeComponent)
  },
  {
    path: 'leaderboard',
    loadComponent: () =>
      import('./pages/leaderboard/leaderboard.component').then(m => m.LeaderboardComponent)
  },
  {
    path: '**',
    loadComponent: () =>
      import('./pages/page-not-found/page-not-found.component').then(m => m.PageNotFoundComponent)
  }
];


