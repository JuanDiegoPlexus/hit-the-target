import { isPlatformBrowser } from '@angular/common';
import {
  Component,
  ElementRef,
  ViewChild,
  AfterViewInit,
  Inject,
  PLATFORM_ID,
} from '@angular/core';
import gsap from 'gsap';

@Component({
  selector: 'app-playbutton',
  standalone: true,
  imports: [],
  templateUrl: './playbutton.component.html',
  styleUrl: './playbutton.component.scss',
})
export class PlaybuttonComponent implements AfterViewInit {
  @ViewChild('playButtonElement')
  private playButtonElement!: ElementRef<HTMLDivElement>;
  private breatheTween?: gsap.core.Tween;

  constructor(@Inject(PLATFORM_ID) private platformId: object) {}

  ngAfterViewInit(): void {
    if (isPlatformBrowser(this.platformId) && this.playButtonElement) {
      this.startBreathe();
    }
  }

  private startBreathe(): void {
    this.breatheTween = gsap.to(this.playButtonElement.nativeElement, {
      scale: 1.08,
      duration: 1.2,
      yoyo: true,
      repeat: -1,
      ease: 'power1.inOut',
    });
  }

  public dissapear(): void {
    if (this.playButtonElement) {
      gsap.to(this.playButtonElement.nativeElement, {
        scale: 0,
        duration: 0.4,
        ease: 'power1.in',
      });
    }
  }

  public hoverPlayButton(): void {
    if (this.playButtonElement) {
      gsap.to(this.playButtonElement.nativeElement, {
        scale: 1.2,
        duration: 0.4,
        ease: 'power1.in',
      });
    }
  }

  public hoverLeaveButton(): void {
    if (this.playButtonElement) {
      gsap.to(this.playButtonElement.nativeElement, {
        scale: 1.08,
        duration: 0.4,
        ease: 'power1.out',
        onComplete: () => {
          //this.breatheTween.
        },
      });
    }
  }
}
