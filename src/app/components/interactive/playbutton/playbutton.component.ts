import { Component, ElementRef, ViewChild } from '@angular/core';

@Component({
  selector: 'app-playbutton',
  standalone: true,
  imports: [],
  templateUrl: './playbutton.component.html',
  styleUrl: './playbutton.component.scss',
})
export class PlaybuttonComponent {
  @ViewChild('playButtonElement')
  private playButtonElement!: ElementRef<HTMLImageElement>;

  public dissapear(): void {
    if (this.playButtonElement) {
      const playButton = this.playButtonElement.nativeElement;
      playButton.classList.remove('dissapear');
      void playButton.offsetWidth;
      playButton.classList.add('dissapear');
    }
  }
}
