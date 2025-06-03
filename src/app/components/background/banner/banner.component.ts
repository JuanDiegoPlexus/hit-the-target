import { Component, AfterViewInit, Inject, PLATFORM_ID, ElementRef, ViewChild } from '@angular/core'
import { isPlatformBrowser } from '@angular/common'
import { gsap } from 'gsap'

@Component({
  selector: 'app-banner',
  standalone: true,
  imports: [],
  templateUrl: './banner.component.html',
  styleUrls: ['./banner.component.scss'],
})
export class BannerComponent implements AfterViewInit {
  constructor(@Inject(PLATFORM_ID) private platformId: object) {}

  @ViewChild('logoElement', { static: true })
  logoElement!: ElementRef<HTMLElement>

  ngAfterViewInit(): void {
    if (isPlatformBrowser(this.platformId) && this.logoElement) {
      gsap.set(this.logoElement.nativeElement, {
        y: -100,
        opacity: 0,
      })
      this.animateLogoDown()
    }
  }

  public animateLogoUp(): void {
    if (isPlatformBrowser(this.platformId) && this.logoElement) {
      gsap.to(this.logoElement.nativeElement, {
        y: -100,
        opacity: 0,
        duration: 0.4,
        ease: 'power1.in',
      })
    }
  }

  public animateLogoDown(): void {
    if (isPlatformBrowser(this.platformId) && this.logoElement) {
      gsap.to(this.logoElement.nativeElement, {
        y: 0,
        opacity: 1,
        duration: 0.4,
        ease: 'power1.out',
      })
    }
  }
}
