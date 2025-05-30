import { Injectable } from '@angular/core'
import { CanActivate, NavigationStart, Router } from '@angular/router'

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  private internalNavigation = false

  constructor(private router: Router) {
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationStart) {
        this.internalNavigation = true
      }
    })
  }

  canActivate(): boolean {
    if (!this.internalNavigation) {
      this.router.navigate(['/'])
      return false
    }

    return true
  }
}
