import { Component, inject, ViewChild } from '@angular/core';
import { RopeComponent } from '../../components/interactive/rope/rope.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-stats',
  standalone: true,
  imports: [RopeComponent],
  templateUrl: './stats.component.html',
  styleUrl: './stats.component.scss',
})
export class StatsComponent {
  private router = inject(Router);
  @ViewChild(RopeComponent) ropeComponent!: RopeComponent;

  animationAndRedirection(ropeClass: string, route: string) {
    if (this.ropeComponent) {
      this.ropeComponent.ropePull();
    }

    setTimeout(() => {
      this.router.navigate([route]);
    }, 400);
  }
}
