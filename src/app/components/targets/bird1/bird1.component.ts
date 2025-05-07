import { Component, ElementRef, EventEmitter, Inject, Input, OnInit, Output, PLATFORM_ID, ViewChild, OnDestroy } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-bird1',
  standalone: true,
  imports: [],
  templateUrl: './bird1.component.html',
  styleUrls: ['./bird1.component.css']
})
export class Bird1Component implements OnInit, OnDestroy {
  @ViewChild('yellowBirdElement', { static: true }) yellowbirdElement!: ElementRef<HTMLImageElement>;
  @Input() id!: number; // Recibe el identificador único del pájaro
  @Output() birdDestroyed = new EventEmitter<number>(); // Emite el identificador al destruir el pájaro

  private animationFrameId: number | null = null; // ID del frame de animación
  private wingSpeed = 100; // Velocidad en milisegundos (1s por defecto)
  private speed = 1.3; //VELOCIDAD CON LA QUE LLEGAN AL FINAL DE LA PANTALLA
  private destroyed = false; // Bandera para verificar si el pájaro ha sido destruido
  private images = [
    'assets/birds/yellow_flying_1.png',
    'assets/birds/yellow_flying_2.png'
  ];

  private images_explosion = [
    'assets/explosion/small_explosion.png',
    'assets/explosion/big_explosion.png'
  ];

  private currentImageIndex = 0;

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {}

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.moveRandomly(this.speed, this.wingSpeed);
      this.startFrameCheck(); // Inicia la comprobación en cada frame
    }
  }

  ngOnDestroy(): void {
    if (this.animationFrameId !== null) {
      cancelAnimationFrame(this.animationFrameId); // Cancela el frame de animación al destruir el componente
    }
  }

  private startFrameCheck(): void {
    if (!isPlatformBrowser(this.platformId)) {
      return; // No ejecutar en el servidor
    }

    const checkBounds = () => {
      if (this.checkIfBirdIsOutOfBounds()) {
        console.log('The bird is out of bounds!');
        this.destroyComponent();
        return;
      }

      this.animationFrameId = requestAnimationFrame(checkBounds);
    };

    this.animationFrameId = requestAnimationFrame(checkBounds);
  }

  private destroyComponent(): void {
    console.log('Destroying bird component...');
    this.birdDestroyed.emit(this.id); // Emite el identificador único al padre
    const bird = this.yellowbirdElement.nativeElement;
    bird.remove(); 
  }

  private checkIfBirdIsOutOfBounds(): boolean {
    const bird = this.yellowbirdElement.nativeElement;

    // Obtén la transformación actual del pájaro
    const transform = window.getComputedStyle(bird).transform;

    if (transform === 'none') {
      return false; // Si no hay transformación, el pájaro no se ha movido
    }

    // Extrae las coordenadas de la transformación (matriz de transformación)
    const matrix = transform.match(/matrix\((.+)\)/);
    if (!matrix || matrix.length < 2) {
      return false; // Si no hay matriz válida, no se puede calcular
    }

    const values = matrix[1].split(', ');
    const translateX = parseFloat(values[4]); // Coordenada X
    const translateY = parseFloat(values[5]); // Coordenada Y

    // Calcula los bordes del pájaro
    const birdRightEdge = translateX + bird.offsetWidth;
    const birdBottomEdge = translateY + bird.offsetHeight;

    // Verifica si el pájaro se ha salido de los límites de la pantalla
    const isOutOfBounds =
      birdRightEdge > window.innerWidth || translateX < 0 || birdBottomEdge > window.innerHeight || translateY < 0;

    return isOutOfBounds;
  }

  moveRandomly(speed: number, wingSpeed: number): void {
    const bird = this.yellowbirdElement.nativeElement;
    let currentTurn = 0;

    const move = () => {
      if (currentTurn === 0) {
        // Solo para la posición inicial
        const initialY = (Math.random() * (window.innerHeight/1.5)); // Número aleatorio en el rango del eje Y
        bird.style.transform = `translate(0px, ${initialY}px)`;
      }

      // Calcula nuevas posiciones aleatorias
      const randomX = Math.random() * (window.innerWidth - bird.offsetWidth) * 0.7 + window.innerWidth * speed;
      const randomY = Math.random() * (window.innerHeight - bird.offsetHeight);

      // Aplica la nueva posición
      bird.style.transform = `translate(${randomX}px, ${randomY}px)`;

      // Cambia la imagen
      this.currentImageIndex = (this.currentImageIndex + 1) % this.images.length;
      bird.src = this.images[this.currentImageIndex];

      currentTurn++;
      setTimeout(move, wingSpeed);
    };

    move();
  }

  triggerExplosion(): void {
    // Cancela cualquier animación en curso
    /*if (this.animationFrameId !== null) {
      cancelAnimationFrame(this.animationFrameId); // Cancela el frame de animación
      this.animationFrameId = null;
    }

    // Detiene el movimiento del pájaro
    const bird = this.yellowbirdElement.nativeElement;
    //bird.style.transition = 'none'; // Detiene cualquier transición o animación CSS

    // Cambia la imagen a la de explosión
    bird.src = this.images_explosion[0];
    
    console.log(`Bird ${this.id} exploded!`);
    setTimeout(() => {
    this.destroyComponent();
    }, 500); // Espera 0.5 segundos antes de eliminar el componente*/
  }
}
