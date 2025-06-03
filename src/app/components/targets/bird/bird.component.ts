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
} from '@angular/core'
import { isPlatformBrowser } from '@angular/common'
import { gsap } from 'gsap'
import { BoundaryDetectionService } from '../../../services/boundary-detection.service'
import { DamageAnimationService } from '../../../services/damage-animation.service'
import { GameStatsService } from '../../../services/game-stats.service'
import { PlayerService } from '../../../services/player.service'

@Component({
  selector: 'app-bird',
  standalone: true,
  imports: [],
  templateUrl: './bird.component.html',
  styleUrls: ['./bird.component.scss'],
  providers: [BoundaryDetectionService],
})
export class BirdComponent implements OnInit, OnDestroy, OnChanges {
  @ViewChild('yellowBirdElement', { static: true })
  private yellowbirdElement!: ElementRef<HTMLImageElement>
  @Input() public id!: number
  public maxHealth: number = 1
  public health: number = 1
  @Input() public isPaused = false
  @Input() public inShop = false

  @Output() birdDestroyed = new EventEmitter<{
    id: number
    byClick: boolean
  }>()

  private animationFrameId: number | null = null
  private wingSpeed = 100
  private speed = 1

  private isDestroyed = false
  private images = ['assets/birds/yellow_flying_1.avif', 'assets/birds/yellow_flying_2.avif']

  private images_explosion = [
    'assets/explosion/small_explosion.png',
    'assets/explosion/big_explosion.png',
  ]

  private currentImageIndex = 0
  private isBrowser: boolean = false

  constructor(
    @Inject(PLATFORM_ID) private platformId: object,
    private boundaryDetectionService: BoundaryDetectionService,
    private damageAnimationService: DamageAnimationService,
    private gameStatsService: GameStatsService,
    private playerService: PlayerService,
  ) {}

  ngOnInit(): void {
    this.isBrowser = isPlatformBrowser(this.platformId)
    if (this.isBrowser) {
      this.spawnBird()
      this.moveRandomly(this.speed)
      this.startWingAnimation()

      const birdElement = this.yellowbirdElement.nativeElement.parentElement as HTMLElement
      this.boundaryDetectionService.registerBird(this.id, birdElement)

      this.boundaryDetectionService.getBirdOutOfBoundsObservable().subscribe((birdId: number) => {
        if (birdId === this.id) {
          this.destroyByOutOfBounds()
        }
      })
    }
  }

  ngOnDestroy(): void {
    if (this.animationFrameId !== null) {
      cancelAnimationFrame(this.animationFrameId)
    }

    const container = this.yellowbirdElement.nativeElement.parentElement as HTMLElement
    gsap.killTweensOf(container)

    this.boundaryDetectionService.unregisterBird(this.id)
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.setMaxHealth()

    if (changes['isPaused']) {
      if (this.isPaused) {
        this.pauseAnimations()
      } else {
        this.resumeAnimations()
      }
    }

    if (changes['inShop']) {
      if (this.inShop) {
        this.pauseAnimations()
      } else {
        this.resumeAnimations()
      }
    }
  }

  private startWingAnimation(): void {
    const bird = this.yellowbirdElement.nativeElement

    gsap.killTweensOf(bird)

    gsap.to(bird, {
      repeat: -1,
      yoyo: true,
      duration: this.wingSpeed / 1000,
      onRepeat: () => {
        this.currentImageIndex = (this.currentImageIndex + 1) % this.images.length
        bird.src = this.images[this.currentImageIndex]
      },
    })
  }

  private destroyByOutOfBounds(): void {
    if (!this.isDestroyed) {
      this.isDestroyed = true
      this.birdDestroyed.emit({ id: this.id, byClick: false })
    }
  }

  private spawnBird(): void {
    if (isPlatformBrowser(this.platformId)) {
      const container = this.yellowbirdElement.nativeElement.parentElement as HTMLElement
      const initialY = Math.random() * (window.innerHeight / 1.5)
      gsap.set(container, { x: 0, y: initialY })
    }
  }

  private moveRandomly(speed: number): void {
    if (isPlatformBrowser(this.platformId)) {
      const container = this.yellowbirdElement.nativeElement.parentElement as HTMLElement

      const animate: () => void = () => {
        const randomX = this.getNextMovementX()
        const randomY = this.getNextMovementY()

        gsap.to(container, {

          x: randomX + randomY / 4,

          y: randomY,
          duration: speed,
          ease: 'linear',
          onComplete: () => {
            if (!this.isDestroyed && !this.isPaused) {
              animate()
            }
          },
        })
      }

      if (!this.isDestroyed && !this.isPaused) {
        animate()
      }
    }
  }

  private getNextMovementX(): number {
    if (isPlatformBrowser(this.platformId)) {
      const container = this.yellowbirdElement.nativeElement.parentElement as HTMLElement

      const currentX = (gsap.getProperty(container, 'x') as number) || 0

      const increment = 50

      const newX = currentX + increment
      return newX
    }
    return 0
  }

  private getNextMovementY(): number {
    if (isPlatformBrowser(this.platformId)) {
      const container = this.yellowbirdElement.nativeElement.parentElement as HTMLElement

      const currentY = (gsap.getProperty(container, 'y') as number) || 0

      const range = 100
      const direction = Math.random() < 0.5 ? -1 : 1
      const movement = direction * Math.random() * range

      const newY = currentY + movement

      return Math.max(0, Math.min(newY, window.innerHeight - container.offsetHeight))
    }
    return 0
  }

  public stopMovement(): void {
    const container = this.yellowbirdElement.nativeElement.parentElement as HTMLElement

    gsap.killTweensOf(container)
    this.isPaused = true
  }

  private pauseAnimations(): void {
    const container = this.yellowbirdElement.nativeElement.parentElement as HTMLElement

    gsap.killTweensOf(container)
    gsap.killTweensOf(this.yellowbirdElement.nativeElement)
  }

  private resumeAnimations(): void {
    const container = this.yellowbirdElement.nativeElement.parentElement as HTMLElement

    gsap.killTweensOf(container)
    this.moveRandomly(this.speed)
    this.startWingAnimation()
  }

  public get getId(): number {
    return this.id
  }

  public takeDamage(amount: number): void {
    this.health = Math.max(this.health - amount, 0)

    const birdElement = this.yellowbirdElement.nativeElement.parentElement as HTMLElement
    this.damageAnimationService.showDamageAnimation(birdElement, this.gameStatsService.damageLevel)
  }

  public setMaxHealth(): void {
    this.maxHealth = this.playerService.getDifficulty() * 2
    this.health = this.maxHealth
  }

  @HostListener('touchstart', ['$event'])
  onTouchStart(event: TouchEvent): void {
    event.preventDefault()
    this.handleBirdClick()
  }

  @HostListener('mousedown', ['$event'])
  onMouseDown(): void {
    this.handleBirdClick()
  }

  private handleBirdClick(): void {
    if (!this.isDestroyed && !this.isPaused) {
      this.takeDamage(this.gameStatsService.damageLevel)
      if (this.health <= 0) {
        this.isDestroyed = true
        this.gameStatsService.addCoins(1)
        this.birdDestroyed.emit({ id: this.id, byClick: true })
      }
    }
  }
}
