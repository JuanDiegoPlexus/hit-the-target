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
  OnChanges,
  SimpleChanges,
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
export class BirdComponent implements OnInit, OnDestroy, OnChanges {
  @ViewChild('yellowBirdElement', { static: true })
  private yellowbirdElement!: ElementRef<HTMLImageElement>;
  @Input() public id!: number;
  public maxHealth: number = 1;
  @Input() public isPaused = false;
  @Input() public health: number = this.maxHealth;

  @Output() birdDestroyed = new EventEmitter<{
    id: number;
    byClick: boolean;
  }>();

  private animationFrameId: number | null = null;
  private wingSpeed = 100;
  private speed = 1;

  private isDestroyed = false;
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

    const container = this.yellowbirdElement.nativeElement
      .parentElement as HTMLElement;
    gsap.killTweensOf(container);
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.setMaxHealth(this.health);

    if (changes['isPaused']) {
      if (this.isPaused) {
        this.pauseAnimations();
      } else {
        this.resumeAnimations();
      }
    }
  }

  private startWingAnimation(): void {
    const bird = this.yellowbirdElement.nativeElement;

    // Detén cualquier animación activa en el pájaro
    gsap.killTweensOf(bird);

    // Inicia la animación de las alas
    gsap.to(bird, {
      repeat: -1, // Repite indefinidamente
      yoyo: true, // Alterna entre los estados
      duration: this.wingSpeed / 1000, // Convierte `wingSpeed` a segundos
      onRepeat: () => {
        this.currentImageIndex =
          (this.currentImageIndex + 1) % this.images.length;
        bird.src = this.images[this.currentImageIndex]; // Cambia la imagen del pájaro
      },
    });
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

  private destroyByOutOfBounds(): void {
    if (!this.isDestroyed) {
      this.isDestroyed = true;
      this.birdDestroyed.emit({ id: this.id, byClick: false });
    }
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
    if (isPlatformBrowser(this.platformId)) {
      const container = this.yellowbirdElement.nativeElement
        .parentElement as HTMLElement;
      const initialY = Math.random() * (window.innerHeight / 1.5);
      gsap.set(container, { x: 0, y: initialY });
    }
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
    if (isPlatformBrowser(this.platformId)) {
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
    return 0;
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

  private pauseAnimations(): void {
    const container = this.yellowbirdElement.nativeElement
      .parentElement as HTMLElement;

    gsap.killTweensOf(container);
    gsap.killTweensOf(this.yellowbirdElement.nativeElement);
  }

  private resumeAnimations(): void {
    const container = this.yellowbirdElement.nativeElement
      .parentElement as HTMLElement;

    gsap.killTweensOf(container);
    this.moveRandomly(this.speed);
    this.startWingAnimation();
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
}
