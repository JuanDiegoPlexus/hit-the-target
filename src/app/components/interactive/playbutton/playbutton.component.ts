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

  constructor(@Inject(PLATFORM_ID) private platformId: object) {}

  ngAfterViewInit(): void {
    if (isPlatformBrowser(this.platformId) && this.playButtonElement) {
      this.hoverPlayButton(false);
    }
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

  public hoverPlayButton(isHover: boolean): void {
    if (!this.playButtonElement) return;

    if (isHover) {
      gsap.to(this.playButtonElement.nativeElement, {
        scale: 1.2,
        duration: 0.6,
        ease: 'power1.in',
        repeat: -1,
        yoyo: true,
      });
    } else {
      gsap.killTweensOf(this.playButtonElement.nativeElement);

      const tl = gsap.timeline();
      tl.to(this.playButtonElement.nativeElement, {
        scale: 1,
        duration: 0.4,
        ease: 'power1.out',
      }).to(this.playButtonElement.nativeElement, {
        scale: 1.05,
        duration: 1,
        repeat: -1,
        yoyo: true,
        ease: 'power1.out',
      });
    }
  }
}
