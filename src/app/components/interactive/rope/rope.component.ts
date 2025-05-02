import { Component, ElementRef, Input, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-rope',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './rope.component.html',
  styleUrls: ['./rope.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class RopeComponent implements OnInit {
  @Input() customClass!: string;
  @ViewChild('ropeElement') ropeElement!: ElementRef<HTMLImageElement>;

  ngOnInit(): void {
    
  }

  ropePull(): void {
    if (this.ropeElement) {
      const rope = this.ropeElement.nativeElement;
      rope.classList.remove('bounce'); 
      void rope.offsetWidth;
      rope.classList.add('bounce');
    } else {
      console.error('Rope element not found for:', this.customClass); // Depuración
    }
  }
}
