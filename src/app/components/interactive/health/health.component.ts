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
  private firstHeartElement!: ElementRef<HTMLImageElement>;
  @ViewChild('secondHeartElement')
  private secondHeartElement!: ElementRef<HTMLImageElement>;
  @ViewChild('thirdHeartElement')
  private thirdHeartElement!: ElementRef<HTMLImageElement>;

  public damage(): void {
    const hearts = [
      this.firstHeartElement.nativeElement,
      this.secondHeartElement.nativeElement,
      this.thirdHeartElement.nativeElement,
    ];

    for (const heart of hearts) {
      if (heart.src.includes('assets/hearts/heart.avif')) {
        heart.src = 'assets/hearts/half_heart.avif';
        console.log('Heart changed to half heart:', heart.src);
        return;
      } else if (heart.src.includes('assets/hearts/half_heart.avif')) {
        heart.src = 'assets/hearts/broken_heart.avif';
        return;
      }
    }
  }
}
