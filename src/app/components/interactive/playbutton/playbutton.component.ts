import { isPlatformBrowser } from '@angular/common';
import {
  Component,
  ElementRef,
  ViewChild,
  AfterViewInit,
  Inject,
  PLATFORM_ID,
} from '@angular/core';
import { gsap } from 'gsap';

@Component({
  selector: 'app-playbutton',
  standalone: true,
  imports: [],
  templateUrl: './playbutton.component.html',
  styleUrl: './playbutton.component.scss',
})
export class PlaybuttonComponent implements AfterViewInit {
  @ViewChild('playButtonElement')
  private playButtonElement!: ElementRef<HTMLImageElement>;
  constructor(@Inject(PLATFORM_ID) private platformId: object) {}

  ngAfterViewInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      if (this.playButtonElement) {
        gsap.to(this.playButtonElement.nativeElement, {
          scale: 1.08,
          duration: 1.2,
          yoyo: true,
          repeat: -1,
          ease: 'power1.inOut',
        });
      }
    }
  }

  public dissapear(): void {
    if (this.playButtonElement) {
      const playButton = this.playButtonElement.nativeElement;
      gsap.to(playButton, {
        scale: 0,
        duration: 0.4,
        ease: 'power1.in',
      });
    }
  }
}
