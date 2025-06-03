import { Injectable, NgZone } from '@angular/core'
import { BehaviorSubject } from 'rxjs'

@Injectable({
  providedIn: 'root',
})
export class VisibilityService {
  private visibilitySubject = new BehaviorSubject<boolean>(true)
  public visibility$ = this.visibilitySubject.asObservable()

  constructor(private ngZone: NgZone) {
    this.initVisibilityListener()
  }

  private initVisibilityListener(): void {
    if (this.isBrowser()) {
      document.addEventListener('visibilitychange', () => {
        this.ngZone.run(() => {
          const isVisible = document.visibilityState === 'visible'
          this.visibilitySubject.next(isVisible)
        })
      })
    }
  }

  private isBrowser(): boolean {
    return typeof window !== 'undefined' && typeof document !== 'undefined'
  }
}
