import { Component, ElementRef, ViewChild } from '@angular/core';

@Component({
  selector: 'app-health',
  standalone: true,
  imports: [],
  templateUrl: './health.component.html',
  styleUrls: ['./health.component.css']
})
export class HealthComponent {
  @ViewChild('firstHeartElement') firstHeartElement!: ElementRef<HTMLImageElement>;
  @ViewChild('secondHeartElement') secondHeartElement!: ElementRef<HTMLImageElement>;
  @ViewChild('thirdHeartElement') thirdHeartElement!: ElementRef<HTMLImageElement>;

  damage(): void {
    const hearts = [
      this.firstHeartElement.nativeElement,
      this.secondHeartElement.nativeElement,
      this.thirdHeartElement.nativeElement
    ];

    for (const heart of hearts) {
      if (heart.src.includes('assets/hearts/hear.png')) {
        heart.src = 'assets/hearts/half_heart.png'; // Cambia a medio corazón
        return;
      } else if (heart.src.includes('assets/hearts/half_heart.png')) {
        heart.src = 'assets/hearts/broken_heart.png'; // Cambia a corazón roto
        return;
      }
    }

    console.log('All hearts are already broken.');
  }
}


