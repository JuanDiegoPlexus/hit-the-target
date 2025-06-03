import { Component, inject, ViewChild } from '@angular/core'
import { Router } from '@angular/router'
import { RopeComponent } from '../../components/interactive/rope/rope.component'
import { LeaderboardComponent } from '../../components/interactive/leaderboard/leaderboard.component'

@Component({
  selector: 'app-leaderboard-page',
  standalone: true,
  templateUrl: './leaderboard-page.component.html',
  styleUrls: ['./leaderboard-page.component.scss'],
  imports: [RopeComponent, LeaderboardComponent],
})
export class LeaderboardPageComponent {
  private router = inject(Router)
  @ViewChild(RopeComponent) private ropeComponent!: RopeComponent
  @ViewChild(LeaderboardComponent)
  private leaderboardComponent!: LeaderboardComponent

  public animationAndRedirection(route: string): void {
    if (this.leaderboardComponent) {
      this.leaderboardComponent.leaderboardFall()
    }

    if (this.ropeComponent) {
      this.ropeComponent.ropePull()
    }

    setTimeout(() => {
      this.router.navigate([route])
    }, 400)
  }
}
