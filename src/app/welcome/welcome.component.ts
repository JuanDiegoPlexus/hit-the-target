import { AfterViewInit, Component, inject, PLATFORM_ID } from '@angular/core';
import { FormsModule } from '@angular/forms'; 
import { isPlatformBrowser } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-welcome',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './welcome.component.html',
  styleUrls: ['./welcome.component.scss']
})
export class WelcomeComponent implements AfterViewInit {

  private platformId = inject(PLATFORM_ID);

  constructor(private router: Router) {}

  ngAfterViewInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      const video = document.querySelector('video');
      if (video) {
        video.muted = true;
        video.play().catch(err => {
          console.warn('Autoplay bloqueado:', err);
        });
      }
  
      const logo = document.querySelector('.logo');
      if (logo) {
        logo.classList.remove('logo-subir', 'logo-oculto', 'logo-sin-animacion');
        void (logo as HTMLElement).offsetWidth;
  
      
        logo.classList.add('logo-sin-animacion');
  
       
        logo.classList.add('logo-bajar');
  
        setTimeout(() => {
          logo.classList.remove('logo-bajar', 'logo-sin-animacion');
        }, 500);
      }
    }
  }
  
  

  animarYRedirigir(clase: string, ruta: string) {
    const cuerda = document.querySelector('.' + clase);
    const logo = document.querySelector('.logo');
  
    if (cuerda) {
      cuerda.classList.remove('rebote');
      void (cuerda as HTMLElement).offsetWidth;
      cuerda.classList.add('rebote');
    }
  
    if (logo) {
      logo.classList.add('logo-subir');
    }
  
    setTimeout(() => {
      this.router.navigate([ruta]);
    }, 400); // Igual que la duración de la animación
  }
  

  description = 'Ésta página es la página de welcome del juego Hit the Target.';
  nombre: any;
}
