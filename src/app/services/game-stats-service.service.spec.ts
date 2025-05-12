import { TestBed } from '@angular/core/testing';

import { GameStatsServiceService } from './game-stats-service.service';

describe('GameStatsServiceService', () => {
  let service: GameStatsServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GameStatsServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
