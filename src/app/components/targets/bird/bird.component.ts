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
  HostListener,
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
  public maxHealth: number = 1;

  @Input() public health: number = this.maxHealth;

  @Output() birdDestroyed = new EventEmitter<{
    id: number;
    byClick: boolean;
  }>();

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

  @HostListener('touchstart', ['$event'])
  onTouchStart(event: TouchEvent): void {
    event.preventDefault();
    this.handleBirdClick(event);
  }

  @HostListener('mousedown', ['$event'])
  onMouseDown(event: MouseEvent): void {
    this.handleBirdClick(event);
  }

  private handleBirdClick(event: Event): void {
    if (!this.isDestroyed && !this.isPaused) {
      this.takeDamage(1);
      if (this.health <= 0) {
        this.isDestroyed = true;
        this.birdDestroyed.emit({ id: this.id, byClick: true });
      }
    }
  }

  private destroyByOutOfBounds(): void {
    if (!this.isDestroyed) {
      this.isDestroyed = true;

      this.birdDestroyed.emit({ id: this.id, byClick: false });
      const container = this.yellowbirdElement.nativeElement
        .parentElement as HTMLElement;
      container.remove();
    }
  }

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.spawnBird();
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
        this.destroyByOutOfBounds();
        return;
      }

      this.animationFrameId = requestAnimationFrame(checkBounds);
    };

    this.animationFrameId = requestAnimationFrame(checkBounds);
  }

  private checkIfBirdIsOutOfBounds(): boolean {
    const container = this.yellowbirdElement.nativeElement
      .parentElement as HTMLElement;

    const translateX = (gsap.getProperty(container, 'x') as number) || 0;
    const translateY = (gsap.getProperty(container, 'y') as number) || 0;

    const containerRightEdge = translateX + container.offsetWidth;
    const containerBottomEdge = translateY + container.offsetHeight;

    const isOutOfBounds =
      containerRightEdge > window.innerWidth ||
      translateX < 0 ||
      containerBottomEdge > window.innerHeight ||
      translateY < 0;

    return isOutOfBounds;
  }

  private spawnBird(): void {
    const container = this.yellowbirdElement.nativeElement
      .parentElement as HTMLElement;
    const initialY = Math.random() * (window.innerHeight / 1.5);
    gsap.set(container, { x: 0, y: initialY });
  }

  private moveRandomly(speed: number): void {
    const container = this.yellowbirdElement.nativeElement
      .parentElement as HTMLElement;

    const animate = () => {
      const randomX = this.getNextMovementX();
      const randomY = this.getNextMovementY();

      gsap.to(container, {
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
    };

    if (!this.isDestroyed && !this.isPaused) {
      animate();
    }
  }

  private getNextMovementX(): number {
    const container = this.yellowbirdElement.nativeElement
      .parentElement as HTMLElement;

    const currentX = (gsap.getProperty(container, 'x') as number) || 0;

    const increment = 50;

    const newX = currentX + increment;
    return newX;
  }

  private getNextMovementY(): number {
    const container = this.yellowbirdElement.nativeElement
      .parentElement as HTMLElement;

    const currentY = (gsap.getProperty(container, 'y') as number) || 0;

    const range = 100;
    const direction = Math.random() < 0.5 ? -1 : 1;
    const movement = direction * Math.random() * range;

    const newY = currentY + movement;

    return Math.max(
      0,
      Math.min(newY, window.innerHeight - container.offsetHeight),
    );
  }

  private animateWings(): void {
    const bird = this.yellowbirdElement.nativeElement;

    this.currentImageIndex = (this.currentImageIndex + 1) % this.images.length;
    bird.src = this.images[this.currentImageIndex];
  }

  public stopMovement(): void {
    const container = this.yellowbirdElement.nativeElement
      .parentElement as HTMLElement;

    gsap.killTweensOf(container);
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

  public increaseHealth(amount: number): void {
    this.health = Math.min(this.health + amount, this.maxHealth);
  }

  public takeDamage(amount: number): void {
    this.health = Math.max(this.health - amount, 0);
  }

  public setMaxHealth(newMaxHealth: number): void {
    this.maxHealth = newMaxHealth;
    this.health = this.maxHealth;
  }
}
