import { Component, ElementRef, Input, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RopeArrowDirectionComponent } from '../rope-arrow-direction/rope-arrow-direction.component';

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

  public ropePull(): void {
    if (this.ropeElement) {
      const rope = this.ropeElement.nativeElement;
      rope.classList.remove('bounce');
      void rope.offsetWidth;
      rope.classList.add('bounce');
    }
  }
}
