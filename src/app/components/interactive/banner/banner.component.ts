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
    if (isPlatformBrowser(this.platformId)) {
      const logo = document.querySelector('.logo');
      if (logo) {
        logo.addEventListener('animationend', () => {
          logo.classList.remove('logo-up', 'logo-down');
        });
      }
    }
  }

  animateLogoUp(): void {
    if (isPlatformBrowser(this.platformId)) {
      const logo = document.querySelector('.logo');
      if (logo) {
        logo.classList.remove('logo-up'); // Elimina la clase para reiniciar la animación
        void (logo as HTMLElement).offsetWidth; // Fuerza el reflujo para reiniciar la animación
        logo.classList.add('logo-up'); // Vuelve a agregar la clase para activar la animación
      }
    }
  }

  animateLogoDown(): void {
    if (isPlatformBrowser(this.platformId)) {
        const logo = document.querySelector('.logo');
        if (logo) {
            console.log('Applying logo-down animation'); // Depuración
            logo.classList.remove('logo-up'); // Elimina la clase previa
            void (logo as HTMLElement).offsetWidth; // Fuerza el reflujo para reiniciar la animación
            logo.classList.add('logo-down'); // Agrega la clase para activar la animación
        } else {
            console.warn('Logo element not found, skipping animation'); // Depuración
        }
    }
  }
}
