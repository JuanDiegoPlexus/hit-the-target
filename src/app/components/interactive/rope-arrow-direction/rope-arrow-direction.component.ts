import {
  Component,
  ElementRef,
  Input,
  ViewChild,
  ViewEncapsulation,
} from '@angular/core';

@Component({
  selector: 'app-rope-arrow-direction',
  standalone: true,
  imports: [],
  templateUrl: './rope-arrow-direction.component.html',
  styleUrls: ['./rope-arrow-direction.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class RopeArrowDirectionComponent {
  @ViewChild('arrowDirectionElement')
  arrowDirectionElement!: ElementRef<HTMLImageElement>;
  isShaking = false;
  @Input() rotation: number = 0;

  tremble(): void {
    if (this.arrowDirectionElement) {
      const playButton = this.arrowDirectionElement.nativeElement;
      playButton.classList.remove('tremble');
      void playButton.offsetWidth;
      playButton.classList.add('tremble');
    }
  }
}
