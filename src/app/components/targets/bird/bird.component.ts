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
import { gsap } from 'gsap';

@Component({
  selector: 'app-bird',
  standalone: true,
  imports: [],
  templateUrl: './bird.component.html',
  styleUrls: ['./bird.component.scss'],
})
export class BirdComponent implements OnInit, OnDestroy {
  @ViewChild('yellowBirdElement', { static: true })
  private yellowbirdElement!: ElementRef<HTMLImageElement>;
  @Input() public id!: number;
  @Output() private birdDestroyed = new EventEmitter<number>();

  private animationFrameId: number | null = null;
  private wingSpeed = 100;
  private speed = 1;

  private probXAxis = 0.9;

  private isDestroyed = false;
  private isPaused = false;
  private images = [
    'assets/birds/yellow_flying_1.avif',
    'assets/birds/yellow_flying_2.avif',
  ];

  private images_explosion = [
    'assets/explosion/small_explosion.png',
    'assets/explosion/big_explosion.png',
  ];

  private currentImageIndex = 0;

  constructor(@Inject(PLATFORM_ID) private platformId: object) {}

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.moveRandomly(this.speed);
      this.startFrameCheck();
      this.startWingAnimation();
    }
  }

  ngOnDestroy(): void {
    if (this.animationFrameId !== null) {
      cancelAnimationFrame(this.animationFrameId);
    }
  }

  private lastWingAnimationTime = 0;

  private startWingAnimation(): void {
    const animate = (timestamp: number) => {
      const elapsed = timestamp - this.lastWingAnimationTime;

      if (elapsed >= this.wingSpeed) {
        this.animateWings();
        this.lastWingAnimationTime = timestamp;
      }

      if (!this.isDestroyed && !this.isPaused) {
        requestAnimationFrame(animate);
      }
    };
    requestAnimationFrame(animate);
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

  private moveRandomly(speed: number): void {
    const bird = this.yellowbirdElement.nativeElement;
    let currentTurn = 0;

    const animate = () => {
      if (currentTurn === 0) {
        const initialY = Math.random() * (window.innerHeight / 1.5);
        //gsap.set(bird, { x: 0, y: initialY });
        bird.style.transform = `translate(0px, ${initialY}px)`;
      }

      const randomX = this.getNextMovementX();
      const randomY = this.getNextMovementY();

      gsap.to(bird, {
        x: randomX,
        y: randomY,
        duration: speed,
        ease: 'linear',
        onComplete: () => {
          if (!this.isDestroyed && !this.isPaused) {
            animate();
          }
        },
      });

      currentTurn++;
    };

    if (!this.isDestroyed && !this.isPaused) {
      animate();
    }
  }

  private getNextMovementX(): number {
    const bird = this.yellowbirdElement.nativeElement;

    const currentX = (gsap.getProperty(bird, 'x') as number) || 0;

    const randomValue = Math.random();

    if (randomValue < this.probXAxis) {
      return currentX + window.innerWidth / 10;
    }

    return currentX;
  }

  private getNextMovementY(): number {
    const bird = this.yellowbirdElement.nativeElement;

    const currentY = (gsap.getProperty(bird, 'y') as number) || 0;

    const centerY = window.innerHeight / 2;

    const range = 100;

    const distanceFromCenter = Math.abs(currentY - centerY);
    const distanceFromEdge = Math.min(currentY, window.innerHeight - currentY);

    const probYAxis =
      (distanceFromEdge / (window.innerHeight / 2)) ** 2 *
      (1 - distanceFromCenter / (window.innerHeight / 2));

    const direction = Math.random() < 0.5 ? -1 : 1;
    const movement = direction * (Math.random() * range * probYAxis);

    const newY = currentY + movement;
    return Math.max(0, Math.min(newY, window.innerHeight - bird.offsetHeight));
  }

  private animateWings(): void {
    const bird = this.yellowbirdElement.nativeElement;

    this.currentImageIndex = (this.currentImageIndex + 1) % this.images.length;
    bird.src = this.images[this.currentImageIndex];
  }

  public stopMovement(): void {
    const bird = this.yellowbirdElement.nativeElement;

    gsap.killTweensOf(bird);
    this.isPaused = true;
  }

  public resumeMovement(): void {
    this.isPaused = false;

    this.moveRandomly(this.speed);
    this.startWingAnimation();
  }

  private triggerExplosion(): void {
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

  public get getId(): number {
    return this.id;
  }
}
