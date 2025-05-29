import { Component, EventEmitter, inject, Output } from '@angular/core'
import { Router } from '@angular/router'

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
