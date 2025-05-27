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

    setTimeout(() => {
      this.router.navigate([route]);
    }, 400);
  }
}
