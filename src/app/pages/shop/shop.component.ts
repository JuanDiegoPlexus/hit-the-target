import { Component, inject, PLATFORM_ID } from '@angular/core';
import { RopeArrowDirectionComponent } from '../../components/interactive/rope-arrow-direction/rope-arrow-direction.component';
import { isPlatformBrowser } from '@angular/common';
import { Router } from '@angular/router';
import { gsap } from 'gsap';

@Component({
  selector: 'app-shop',
  standalone: true,
  imports: [RopeArrowDirectionComponent],
  templateUrl: './shop.component.html',
  styleUrls: ['./shop.component.scss'],
})
export class ShopComponent {
  private platformId = inject(PLATFORM_ID);
  private router = inject(Router);

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
    }
  }

  public animationAndRedirection(ropeClass: string, route: string): void {
    if (route === '/') {
      this.changeSceneToMainMenu();
    }

    setTimeout(() => {
      this.router.navigate([route]);
    }, 1000);
  }

  private changeSceneToMainMenu(): void {
    if (isPlatformBrowser(this.platformId)) {
      const shopContent = document.querySelector(
        '.shop-content',
      ) as HTMLElement;
      const videoElement = document.querySelector('.banner') as HTMLElement;
      const shopImage = document.querySelector('.shop-image') as HTMLElement;

      if (shopContent && videoElement && shopImage) {
        const videoElementY = gsap.getProperty(videoElement, 'y') as number;
        const shopImageBottom = gsap.getProperty(shopImage, 'bottom') as number;

        gsap
          .timeline()
          .to(shopContent, {
            y: '100%',
            duration: 1,
            ease: 'power2.inOut',
          })
          .to(
            videoElement,
            {
              y: videoElementY + 100,
              duration: 1,
              ease: 'power2.inOut',
            },
            '<',
          )
          .to(
            shopImage,
            {
              bottom: shopImageBottom - 100,
              duration: 1,
              ease: 'power2.inOut',
            },
            '<',
          );

        const mainWindow = window.opener || window.parent;
        if (mainWindow) {
          mainWindow.postMessage('animateMainContent', window.location.origin);
        } else {
          console.error('No se pudo encontrar la pestaña principal.');
        }
      }
    }
  }
}
