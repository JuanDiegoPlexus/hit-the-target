import {
  Component,
  ElementRef,
  EventEmitter,
  Inject,
  Input,
  OnInit,
  Output,
  PLATFORM_ID,
  ViewChild,
  OnDestroy,
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-bird1',
  standalone: true,
  imports: [],
  templateUrl: './bird1.component.html',
  styleUrls: ['./bird1.component.scss'],
})
export class Bird1Component implements OnInit, OnDestroy {
  @ViewChild('yellowBirdElement', { static: true })
  yellowbirdElement!: ElementRef<HTMLImageElement>;
  @Input() id!: number;
  @Output() birdDestroyed = new EventEmitter<number>();

  private animationFrameId: number | null = null;
  private wingSpeed = 100;
  private speed = 1.3; //speed of the bird
  private destroyed = false;
  private images = [
    'assets/birds/yellow_flying_1.png',
    'assets/birds/yellow_flying_2.png',
  ];

  private images_explosion = [
    'assets/explosion/small_explosion.png',
    'assets/explosion/big_explosion.png',
  ];

  private currentImageIndex = 0;

  constructor(@Inject(PLATFORM_ID) private platformId: object) {}

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.moveRandomly(this.speed, this.wingSpeed);
      this.startFrameCheck();
    }
  }

  ngOnDestroy(): void {
    if (this.animationFrameId !== null) {
      cancelAnimationFrame(this.animationFrameId);
    }
  }

  private startFrameCheck(): void {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    const checkBounds = () => {
      if (this.checkIfBirdIsOutOfBounds()) {
        this.destroyComponent();
        return;
      }

      this.animationFrameId = requestAnimationFrame(checkBounds);
    };

    this.animationFrameId = requestAnimationFrame(checkBounds);
  }

  private destroyComponent(): void {
    this.birdDestroyed.emit(this.id);
    const bird = this.yellowbirdElement.nativeElement;
    bird.remove();
  }

  private checkIfBirdIsOutOfBounds(): boolean {
    const bird = this.yellowbirdElement.nativeElement;
    const transform = window.getComputedStyle(bird).transform;

    if (transform === 'none') {
      return false;
    }

    const matrix = transform.match(/matrix\((.+)\)/);
    if (!matrix || matrix.length < 2) {
      return false;
    }

    const values = matrix[1].split(', ');
    const translateX = parseFloat(values[4]);
    const translateY = parseFloat(values[5]);

    const birdRightEdge = translateX + bird.offsetWidth;
    const birdBottomEdge = translateY + bird.offsetHeight;

    const isOutOfBounds =
      birdRightEdge > window.innerWidth ||
      translateX < 0 ||
      birdBottomEdge > window.innerHeight ||
      translateY < 0;

    return isOutOfBounds;
  }

  moveRandomly(speed: number, wingSpeed: number): void {
    const bird = this.yellowbirdElement.nativeElement;
    let currentTurn = 0;

    const move = () => {
      if (currentTurn === 0) {
        const initialY = Math.random() * (window.innerHeight / 1.5);
        bird.style.transform = `translate(0px, ${initialY}px)`;
      }

      const randomX =
        Math.random() * (window.innerWidth - bird.offsetWidth) * 0.7 +
        window.innerWidth * speed;
      const randomY = Math.random() * (window.innerHeight - bird.offsetHeight);

      bird.style.transform = `translate(${randomX}px, ${randomY}px)`;

      this.currentImageIndex =
        (this.currentImageIndex + 1) % this.images.length;
      bird.src = this.images[this.currentImageIndex];

      currentTurn++;
      setTimeout(move, wingSpeed);
    };

    if (!this.destroyed) {
      move();
    }
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
