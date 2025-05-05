import { Component, ElementRef, Input, ViewChild } from '@angular/core';

@Component({
  selector: 'app-playbutton',
  standalone: true,
  imports: [],
  templateUrl: './playbutton.component.html',
  styleUrl: './playbutton.component.css'
})
export class PlaybuttonComponent {
  @ViewChild('playButtonElement') playButtonElement!: ElementRef<HTMLImageElement>;

  dissapear(): void {
    if (this.playButtonElement) {
      const rope = this.playButtonElement.nativeElement;
      rope.classList.remove('dissapear'); 
      void rope.offsetWidth;
      rope.classList.add('dissapear');
    } 
  }
}
