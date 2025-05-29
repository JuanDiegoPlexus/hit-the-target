import { isPlatformBrowser } from '@angular/common'
import {
  Component,
  Input,
  ViewEncapsulation,
  ElementRef,
  ViewChild,
  Inject,
  PLATFORM_ID,
} from '@angular/core'
import { gsap } from 'gsap'
@Component({
  selector: 'app-rope-arrow-direction',
  standalone: true,
  templateUrl: './rope-arrow-direction.component.html',
  styleUrls: ['./rope-arrow-direction.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class RopeArrowDirectionComponent {
  @ViewChild('frontImg', { static: true })
  private frontImg!: ElementRef<HTMLImageElement>
  @ViewChild('backImg', { static: true })
  private backImg!: ElementRef<HTMLImageElement>
  private imageIsFlipping: boolean = false
  private pendingFlip: boolean | null = null
  @Input() public rotation: number = 0
  @Input() public srcBackImage: string = ''

  public images = ['assets/leaderboard/direction.avif', this.srcBackImage]

  constructor(@Inject(PLATFORM_ID) private platformId: object) {}

  ngOnChanges(): void {
    this.images[1] = this.srcBackImage
  }

  ngAfterViewInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      if (this.rotation == -90) {
        gsap.set(this.frontImg.nativeElement, {
          rotateX: 0,
          zIndex: 2,
          rotateZ: this.rotation,
        })
        gsap.set(this.backImg.nativeElement, {
          rotateX: 180,
          zIndex: 1,
          rotateZ: 90,
        })
      } else {
        gsap.set(this.frontImg.nativeElement, {
          rotateX: 0,
          zIndex: 2,
          rotateZ: this.rotation,
        })
        gsap.set(this.backImg.nativeElement, {
          rotateX: 180,
          zIndex: 1,
          rotateZ: this.rotation,
        })
      }
    }
  }

  public flip(isHover: boolean): void {
    if (this.imageIsFlipping) {
      this.pendingFlip = isHover
    } else {
      this.imageIsFlipping = true
      this.pendingFlip = null

      let completed = 0
      const onTweenComplete: () => void = () => {
        completed++
        if (completed === 2) {
          this.imageIsFlipping = false
          if (this.pendingFlip !== null) {
            const next = this.pendingFlip
            this.pendingFlip = null
            this.flip(next)
          }
        }
      }
      gsap.to(this.frontImg.nativeElement, {
        rotateX: isHover ? -180 : 0,
        duration: 0.7,
        ease: 'elastic.out(1, 1.5)',
        zIndex: isHover ? 1 : 2,
        onComplete: onTweenComplete,
      })
      gsap.to(this.backImg.nativeElement, {
        rotateX: isHover ? 0 : 180,
        duration: 0.7,
        ease: 'elastic.out(1, 1.5)',
        zIndex: isHover ? 2 : 1,
        onComplete: onTweenComplete,
      })
    }
  }
}
