import { Injectable } from '@angular/core'
import { Observable, Subject } from 'rxjs'
import { gsap } from 'gsap'

@Injectable({
  providedIn: 'root',
})
export class BoundaryDetectionService {
  private registeredBirds: Map<number, HTMLElement> = new Map()
  private birdOutOfBounds$ = new Subject<number>()

  constructor() {
    this.startBoundaryCheck()
  }

  public registerBird(id: number, element: HTMLElement): void {
    this.registeredBirds.set(id, element)
  }

  public unregisterBird(id: number): void {
    this.registeredBirds.delete(id)
  }

  public getBirdOutOfBoundsObservable(): Observable<number> {
    return this.birdOutOfBounds$.asObservable()
  }

  private startBoundaryCheck(): void {
    const checkBounds: () => void = () => {
      this.registeredBirds.forEach((element, id) => {
        const translateX = (gsap.getProperty(element, 'x') as number) || 0
        const translateY = (gsap.getProperty(element, 'y') as number) || 0

        const elementRightEdge = translateX + element.offsetWidth
        const elementBottomEdge = translateY + element.offsetHeight

        const isOutOfBounds =
          elementRightEdge > window.innerWidth ||
          translateX < 0 ||
          elementBottomEdge > window.innerHeight ||
          translateY < 0

        if (isOutOfBounds) {
          this.birdOutOfBounds$.next(id)
        }
      })

      requestAnimationFrame(checkBounds)
    }

    requestAnimationFrame(checkBounds)
  }
}
