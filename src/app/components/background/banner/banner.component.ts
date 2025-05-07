import { Component, AfterViewInit, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-banner',
  standalone: true,
  imports: [],
  templateUrl: './banner.component.html',
  styleUrls: ['./banner.component.css']
})
export class BannerComponent implements AfterViewInit {
  constructor(@Inject(PLATFORM_ID) private platformId: Object) {}

  ngAfterViewInit(): void {
    this.animateLogoDown();
  }

  animateLogoUp(): void {
    if (isPlatformBrowser(this.platformId)) {
      const logo = document.querySelector('.logo');
      if (logo) {
        logo.classList.remove('logo-down'); 
        void (logo as HTMLElement).offsetWidth; 
        logo.classList.add('logo-up'); 
      }
    }
  }

  animateLogoDown(): void {
    if (isPlatformBrowser(this.platformId)) {
        const logo = document.querySelector('.logo');
        if (logo) {
            logo.classList.remove('logo-up'); 
            void (logo as HTMLElement).offsetWidth; 
            logo.classList.add('logo-down'); 
        } 
    }
  }
}
