import { Component, ElementRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-rope',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './rope.component.html',
  styleUrls: ['./rope.component.scss'],
})
export class RopeComponent {
  @ViewChild('ropeElement') ropeElement!: ElementRef<HTMLImageElement>;

  ropePull(): void {
    if (this.ropeElement) {
      const rope = this.ropeElement.nativeElement;
      rope.classList.remove('bounce');
      void rope.offsetWidth;
      rope.classList.add('bounce');
    }
  }
}
