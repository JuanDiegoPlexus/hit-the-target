import { Component, inject, Input, AfterViewInit, ViewChild, ElementRef } from '@angular/core'
import { Router } from '@angular/router'
import { gsap } from 'gsap'

@Component({
  selector: 'app-big-leaderboard',
  standalone: true,
  imports: [],
  templateUrl: './big-leaderboard.component.html',
  styleUrl: './big-leaderboard.component.scss',
})
export class BigLeaderboardComponent implements AfterViewInit {
  private router = inject(Router)
  @Input() public playerName = ''
  @Input() public birdsDestroyed = 0
  @Input() public timeSurvived = 0

  @ViewChild('bigleaderboardElement', { static: true })
  bigleaderboardElement!: ElementRef<HTMLDivElement>

  ngAfterViewInit(): void {
    const endGameBoard = this.bigleaderboardElement.nativeElement
    gsap.set(endGameBoard, {
      opacity: 0,
      rotate: -80,
      y: '-60vh',
      transformOrigin: '50% -15%',
    })
    gsap
      .timeline()
      .to(endGameBoard, {
        opacity: 1,
        rotate: 40,
        y: '-10vh',
        duration: 0.25,
        ease: 'back.out(2)',
      })
      .to(endGameBoard, {
        rotate: -30,
        y: '0vh',
        duration: 0.25,
        ease: 'back.out(2)',
      })
      .to(endGameBoard, {
        rotate: 20,
        y: '0vh',
        duration: 0.25,
        ease: 'back.out(2)',
      })
      .to(endGameBoard, {
        rotate: -10,
        y: '0vh',
        duration: 0.25,
        ease: 'back.out(2)',
      })
      .to(endGameBoard, {
        rotate: 5,
        y: '0vh',
        duration: 0.25,
        ease: 'back.out(2)',
      })
      .to(endGameBoard, {
        rotate: 0,
        y: '0vh',
        duration: 0.1,
        ease: 'power1.out',
      })
  }

  public goHome(): void {
    this.router.navigate(['/'])
  }
}
