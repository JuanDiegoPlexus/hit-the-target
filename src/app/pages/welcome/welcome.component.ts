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

@Component({
  selector: 'app-welcome',
  standalone: true,
  imports: [FormsModule, BannerComponent, RopeComponent, PlaybuttonComponent],
  templateUrl: './welcome.component.html',
  styleUrls: ['./welcome.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class WelcomeComponent implements AfterViewInit {
  private platformId = inject(PLATFORM_ID);

  @ViewChild(BannerComponent) bannerComponent!: BannerComponent;

  @ViewChild('leaderboardRope', { static: true })
  ropeComponentLeaderboard!: RopeComponent;

  @ViewChild('statsRope', { static: true }) ropeComponentStats!: RopeComponent;
  @ViewChild(PlaybuttonComponent) playbuttonComponent!: PlaybuttonComponent;

  constructor(private router: Router) {}

  ngAfterViewInit(): void {
    if (this.bannerComponent) {
      this.bannerComponent.animateLogoDown(); // Llama a la animación hacia abajo al regresar
    } else {
      console.error('BannerComponent is not initialized');
    }

    if (isPlatformBrowser(this.platformId)) {
      const video = document.querySelector('video');
      if (video) {
        video.muted = true;
        video.play().catch((err) => {
          console.warn('Autoplay blocked:', err);
        });
      }
    }
  }

  animationAndRedirection(ropeClass: string, route: string): void {
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

    setTimeout(() => {
      this.router.navigate([route]);
    }, 400);
  }
}
