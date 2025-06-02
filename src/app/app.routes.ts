import { Routes } from '@angular/router'
import { AuthGuard } from './guards/auth.guard'

export const routes: Routes = [
  {
    path: '',
    title: 'Hit the Target',
    loadComponent: () =>
      import('./pages/welcome/welcome.component').then((m) => m.WelcomeComponent),
  },
  {
    path: 'leaderboard',
    canActivate: [AuthGuard],
    loadComponent: () =>
      import('./pages/leaderboard-page/leaderboard-page.component').then(
        (m) => m.LeaderboardPageComponent,
      ),
  },
  {
    path: 'stats',
    canActivate: [AuthGuard],
    loadComponent: () => import('./pages/stats/stats.component').then((m) => m.StatsComponent),
  },
  {
    path: 'game',
    loadComponent: () => import('./pages/game/game.component').then((m) => m.GameComponent),
  },
  {
    path: 'shop',
    canActivate: [AuthGuard],
    loadComponent: () => import('./pages/shop/shop.component').then((m) => m.ShopComponent),
  },
  {
    path: '**',
    loadComponent: () =>
      import('./pages/page-not-found/page-not-found.component').then(
        (m) => m.PageNotFoundComponent,
      ),
  },
]
