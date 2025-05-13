import { Component, inject, ViewChild } from '@angular/core';
import { RopeComponent } from '../../components/interactive/rope/rope.component';
import { Router } from '@angular/router';
import { StatsboardComponent } from '../../components/interactive/statsboard/statsboard.component';

@Component({
  selector: 'app-stats',
  standalone: true,
  imports: [RopeComponent, StatsboardComponent],
  templateUrl: './stats.component.html',
  styleUrl: './stats.component.scss',
})
export class StatsComponent {
  private router = inject(Router);
  @ViewChild(RopeComponent) ropeComponent!: RopeComponent;
  @ViewChild(StatsboardComponent) statsboardComponent!: StatsboardComponent;

  animationAndRedirection(ropeClass: string, route: string) {
    if (this.ropeComponent) {
      this.ropeComponent.ropePull();
    }

    if (this.statsboardComponent) {
      this.statsboardComponent.statsboardFall();
    }

    setTimeout(() => {
      this.router.navigate([route]);
    }, 400);
  }
}
