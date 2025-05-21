import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-pause-tab',
  standalone: true,
  imports: [],
  templateUrl: './pause-tab.component.html',
  styleUrl: './pause-tab.component.scss',
})
export class PauseTabComponent {
  private router = inject(Router);

  public goHome(): void {
    this.router.navigate(['/']);
  }
}
