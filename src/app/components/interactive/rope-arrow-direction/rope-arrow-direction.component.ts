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
  private arrowDirectionElement!: ElementRef<HTMLImageElement>;
  private isShaking = false;
  @Input() public rotation: number = 0;

  public get getRotation() {
    return this.rotation;
  }

  public get getIsShaking() {
    return this.isShaking;
  }

  public tremble(): void {
    if (this.arrowDirectionElement) {
      const playButton = this.arrowDirectionElement.nativeElement;
      playButton.classList.remove('tremble');
      void playButton.offsetWidth;
      playButton.classList.add('tremble');
    }
  }
}
