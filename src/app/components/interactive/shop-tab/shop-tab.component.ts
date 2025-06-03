import { Component } from '@angular/core'
import { GameStatsService } from '../../../services/game-stats.service'

@Component({
  selector: 'app-shop-tab',
  standalone: true,
  imports: [],
  templateUrl: './shop-tab.component.html',
  styleUrls: ['./shop-tab.component.scss'],
})
export class ShopTabComponent {
  constructor(public gameStatsService: GameStatsService) {}
}
