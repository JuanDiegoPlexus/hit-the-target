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
import { BoundaryDetectionService } from '../../../services/bird/boundary-detection.service'
import { DamageAnimationService } from '../../../services/bird/damage-animation.service'
import { GameStatsService } from '../../../services/game/game-stats.service'
import { PlayerService } from '../../../services/player/player.service'

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

  public maxHealth: number = 1
  public health: number = 1
  @Input() public id!: number
  @Input() public isPaused = false
  @Input() public inShop = false
  private isDestroyed = false
  private isBrowser: boolean = false

  @Output() birdDestroyed = new EventEmitter<{
    id: number
    byClick: boolean
  }>()

  private animationFrameId: number | null = null
  private wingSpeed = 100
  private speed = 1

  private images = ['assets/birds/yellow_flying_1.avif', 'assets/birds/yellow_flying_2.avif']

  private images_explosion = [
    'assets/explosion/small_explosion.png',
    'assets/explosion/big_explosion.png',
  ]

  private currentImageIndex = 0

  constructor(
    @Inject(PLATFORM_ID) private platformId: object,
    private boundaryDetectionService: BoundaryDetectionService,
    private damageAnimationService: DamageAnimationService,
    private gameStatsService: GameStatsService,
    private playerService: PlayerService,
  ) {
    this.isBrowser = isPlatformBrowser(this.platformId)
  }

  ngOnInit(): void {
    if (this.isBrowser) {
      this.spawnBird()
      this.moveRandomly(this.speed)
      this.startWingAnimation()

      const container = this.getContainer()
      this.boundaryDetectionService.registerBird(this.id, container)

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

    const container = this.getContainer()
    gsap.killTweensOf(container)

    this.boundaryDetectionService.unregisterBird(this.id)
  }

  ngOnChanges(changes: SimpleChanges): void {
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

  private executeIfNotDestroyed(action: () => void): void {
    if (!this.isDestroyed) {
      action()
    }
  }

  private destroyByOutOfBounds(): void {
    this.executeIfNotDestroyed(() => {
      this.isDestroyed = true
      this.birdDestroyed.emit({ id: this.id, byClick: false })
    })
  }

  private getContainer(): HTMLElement {
    return this.yellowbirdElement.nativeElement.parentElement as HTMLElement
  }

  private spawnBird(): void {
    if (this.isBrowser) {
      const container = this.getContainer()
      const initialY = Math.random() * (window.innerHeight / 1.5)
      gsap.set(container, { x: 0, y: initialY })
      this.setMaxHealth()
    }
  }

  private moveRandomly(speed: number): void {
    if (this.isBrowser) {
      const container = this.getContainer()

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
    const container = this.getContainer()

    const currentX = (gsap.getProperty(container, 'x') as number) || 0

    const increment = 50

    const newX = currentX + increment
    return newX
  }

  private getNextMovementY(): number {
    const container = this.getContainer()

    const currentY = (gsap.getProperty(container, 'y') as number) || 0

    const range = 100
    const direction = Math.random() < 0.5 ? -1 : 1
    const movement = direction * Math.random() * range

    const newY = currentY + movement

    return Math.max(0, Math.min(newY, window.innerHeight - container.offsetHeight))
  }

  public stopMovement(): void {
    const container = this.getContainer()

    gsap.killTweensOf(container)
    this.isPaused = true
  }

  private toggleAnimations(pause: boolean): void {
    const container = this.getContainer()
    gsap.killTweensOf(container)
    gsap.killTweensOf(this.yellowbirdElement.nativeElement)

    if (!pause) {
      this.moveRandomly(this.speed)
      this.startWingAnimation()
    }
  }

  private pauseAnimations(): void {
    this.toggleAnimations(true)
  }

  private resumeAnimations(): void {
    this.toggleAnimations(false)
  }

  public get getId(): number {
    return this.id
  }

  public takeDamage(amount: number): void {
    this.health = Math.max(this.health - amount, 0)

    const container = this.getContainer()
    this.damageAnimationService.showDamageAnimation(container, this.gameStatsService.damageLevel)
  }

  public setMaxHealth(): void {
    this.maxHealth = this.playerService.getDifficulty() * 2
    if (!this.isPaused && !this.inShop) {
      this.health = this.maxHealth
    }
  }

  @HostListener('mousedown')
  @HostListener('touchstart', ['$event'])
  onInteraction(event?: Event): void {
    event?.preventDefault()
    this.handleBirdClick()
  }

  private handleBirdClick(): void {
    this.executeIfNotDestroyed(() => {
      if (!this.isPaused && !this.inShop) {
        this.takeDamage(this.gameStatsService.damageLevel)
        if (this.health <= 0) {
          this.isDestroyed = true
          this.gameStatsService.addCoins(1)
          this.birdDestroyed.emit({ id: this.id, byClick: true })
        }
      }
    })
  }
}
