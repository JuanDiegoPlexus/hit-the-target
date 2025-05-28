import {
  AfterViewInit,
  Component,
  inject,
  PLATFORM_ID,
  ViewChild,
  ViewEncapsulation,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { isPlatformBrowser } from '@angular/common';
import { Router } from '@angular/router';
import { BannerComponent } from '../../components/background/banner/banner.component';
import { RopeComponent } from '../../components/interactive/rope/rope.component';
import { PlaybuttonComponent } from '../../components/interactive/playbutton/playbutton.component';
import { RopeArrowDirectionComponent } from '../../components/interactive/rope-arrow-direction/rope-arrow-direction.component';
import { gsap } from 'gsap';
@Component({
  selector: 'app-welcome',
  standalone: true,
  imports: [
    FormsModule,
    BannerComponent,
    RopeComponent,
    PlaybuttonComponent,
    RopeArrowDirectionComponent,
  ],
  templateUrl: './welcome.component.html',
  styleUrls: ['./welcome.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class WelcomeComponent implements AfterViewInit {
  private platformId = inject(PLATFORM_ID);
  private router = inject(Router);

  @ViewChild(BannerComponent) private bannerComponent!: BannerComponent;

  @ViewChild('leaderboardRope', { static: true })
  private ropeComponentLeaderboard!: RopeComponent;

  @ViewChild('statsRope', { static: true })
  private ropeComponentStats!: RopeComponent;
  @ViewChild(PlaybuttonComponent)
  private playbuttonComponent!: PlaybuttonComponent;

  ngAfterViewInit(): void {
    if (this.bannerComponent) {
      this.bannerComponent.animateLogoDown();
    }
    if (isPlatformBrowser(this.platformId)) {
      const video = document.querySelector('video');
      if (video) {
        video.muted = true;
        video.play();
      }
    }
  }

  afterNextRender(): void {
    if (isPlatformBrowser(this.platformId)) {
      window.addEventListener('message', (event) => {
        if (event.origin !== window.location.origin) {
          return;
        }

        if (event.data === 'animateMainContent') {
          this.animateMainContent();
        }
      });
    }
  }

  private animateMainContent(): void {
    setTimeout(() => {
      const mainContent = document.querySelector(
        '.main-content',
      ) as HTMLElement;
      if (mainContent) {
        console.log(
          'Antes de la animación:',
          gsap.getProperty(mainContent, 'y'),
        );
        gsap.to(mainContent, {
          y: '-100%',
          duration: 1,
          ease: 'power2.inOut',
        });
        console.log(
          'Después de la animación:',
          gsap.getProperty(mainContent, 'y'),
        );
      } else {
        console.error('No se encontró el elemento .main-content');
      }
    }, 0); // Espera un ciclo de eventos para asegurarte de que el DOM esté listo
  }

  private changeSceneToShop(): void {
    if (isPlatformBrowser(this.platformId)) {
      const mainContent = document.querySelector(
        '.main-content',
      ) as HTMLElement;
      const videoElement = document.querySelector('.banner') as HTMLElement;
      const shopImage = document.querySelector('.shop-image') as HTMLElement;

      if (mainContent && videoElement && shopImage) {
        gsap
          .timeline()
          .to(mainContent, {
            y: '-100%',
            duration: 1,
            ease: 'power2.inOut',
          })
          .to(
            videoElement,
            {
              y: '-100%',
              duration: 1,
              ease: 'power2.inOut',
            },
            '<',
          )
          .to(
            shopImage,
            {
              bottom: '100%',
              duration: 1,
              ease: 'power2.inOut',
            },
            '<',
          );
      }
    }
  }

  public animationAndRedirection(ropeClass: string, route: string): void {
    if (ropeClass === 'leaderboardRope' && this.ropeComponentLeaderboard) {
      this.ropeComponentLeaderboard.ropePull();
    } else if (ropeClass === 'statsRope' && this.ropeComponentStats) {
      this.ropeComponentStats.ropePull();
    }

    if (this.bannerComponent) {
      this.bannerComponent.animateLogoUp();
    }

    if (this.playbuttonComponent) {
      this.playbuttonComponent.dissapear();
    }

    if (route === '/shop') {
      this.changeSceneToShop();
    }

    setTimeout(() => {
      console.log(`Navigating to ${route}`);
      this.router.navigate([route]);
    }, 1000);
  }
}
