import { Component, ElementRef, ViewChild } from '@angular/core';

@Component({
  selector: 'app-health',
  standalone: true,
  imports: [],
  templateUrl: './health.component.html',
  styleUrls: ['./health.component.scss'],
})
export class HealthComponent {
  @ViewChild('firstHeartElement')
  firstHeartElement!: ElementRef<HTMLImageElement>;
  @ViewChild('secondHeartElement')
  secondHeartElement!: ElementRef<HTMLImageElement>;
  @ViewChild('thirdHeartElement')
  thirdHeartElement!: ElementRef<HTMLImageElement>;

  damage(): void {
    const hearts = [
      this.firstHeartElement.nativeElement,
      this.secondHeartElement.nativeElement,
      this.thirdHeartElement.nativeElement,
    ];

    for (const heart of hearts) {
      if (heart.src.includes('assets/hearts/heart.avif')) {
        heart.src = 'assets/hearts/half_heart.avif'; // Cambia a medio corazón
        console.log('Heart changed to half heart:', heart.src);
        return;
      } else if (heart.src.includes('assets/hearts/half_heart.avif')) {
        heart.src = 'assets/hearts/broken_heart.avif'; // Cambia a corazón roto
        return;
      }
    }
  }
}
