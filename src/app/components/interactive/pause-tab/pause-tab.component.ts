import { Component, EventEmitter, Output } from '@angular/core'

@Component({
  selector: 'app-pause-tab',
  standalone: true,
  imports: [],
  templateUrl: './pause-tab.component.html',
  styleUrl: './pause-tab.component.scss',
})
export class PauseTabComponent {
  @Output() public goHomeEvent = new EventEmitter<void>()

  public goHome(): void {
    this.goHomeEvent.emit()
  }
}
