import { Component, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { RopeComponent } from "../../components/interactive/rope/rope.component";
import { LeaderboardComponent } from '../../components/interactive/leaderboard/leaderboard.component';

@Component({
  selector: 'app-leaderboard-page',
  standalone: true,
  templateUrl: './leaderboard-page.component.html',
  styleUrls: ['./leaderboard-page.component.css'],
  imports: [RopeComponent, LeaderboardComponent]
})


export class LeaderboardPageComponent {
  constructor(private router: Router) {}

  @ViewChild(RopeComponent) ropeComponent!: RopeComponent;
  @ViewChild(LeaderboardComponent) leaderboardComponent!: LeaderboardComponent;

  animationAndRedirection(ropeClass: string, route: string) {
  
    if (this.leaderboardComponent) {
      this.leaderboardComponent.leaderboardFall();
    }
    
    if (this.ropeComponent) {
      this.ropeComponent.ropePull();
    }
  
    setTimeout(() => {
      this.router.navigate([route]);
    }, 400);
  }
  
  
}

