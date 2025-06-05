import { Injectable } from '@angular/core'
import { gsap } from 'gsap'

@Injectable({
  providedIn: 'root',
})
export class DamageAnimationService {
  public showDamageAnimation(parentElement: HTMLElement, damage: number): void {
    const damageElement = document.createElement('div')
    damageElement.textContent = `-${damage}`
    damageElement.style.position = 'absolute'
    damageElement.style.color = 'red'
    damageElement.style.fontSize = '30px'
    damageElement.style.fontWeight = 'bold'
    damageElement.style.pointerEvents = 'none'
    damageElement.style.fontFamily = 'Stardew, sans-serif'

    document.body.appendChild(damageElement)

    const rect = parentElement.getBoundingClientRect()
    damageElement.style.left = `${rect.left + rect.width / 2}px`
    damageElement.style.top = `${rect.top + rect.height / 2}px`

    gsap.to(damageElement, {
      y: '-80',
      opacity: 0,
      duration: 1,
      ease: 'power1.out',
      onComplete: () => {
        document.body.removeChild(damageElement)
      },
    })
  }
}
