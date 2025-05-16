import { Component, ElementRef, Input, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RopeArrowDirectionComponent } from '../rope-arrow-direction/rope-arrow-direction.component';
import { gsap } from 'gsap';

@Component({
  selector: 'app-rope',
  standalone: true,
  imports: [CommonModule, RopeArrowDirectionComponent],
  templateUrl: './rope.component.html',
  styleUrls: ['./rope.component.scss'],
})
export class RopeComponent {
  @ViewChild('ropeElement') private ropeElement!: ElementRef<HTMLImageElement>;

  @Input() public rotation: number = 0;
  @Input() public srcBackImage: string = '';

  public ropePull(): void {
    if (this.ropeElement) {
      const rope = this.ropeElement.nativeElement;
      gsap.fromTo(
        rope,
        { y: 0 },
        {
          y: '10%',
          duration: 0.2,
          ease: 'power1.in',
          yoyo: true,
          repeat: 1,
          onComplete: () => {
            gsap.set(rope, { y: 0 });
          },
        },
      );
    }
  }
}
