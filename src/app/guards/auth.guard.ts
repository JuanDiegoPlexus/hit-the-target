import { Injectable } from '@angular/core'
import { CanActivate, Router } from '@angular/router'

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  constructor(private router: Router) {}

  canActivate(): boolean {
    if (!window.history.state || !window.history.state.navigationId) {
      this.router.navigate(['/'])
      return false
    }
    return true
  }
}
