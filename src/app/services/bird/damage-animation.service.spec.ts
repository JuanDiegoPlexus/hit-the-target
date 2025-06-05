import { TestBed } from '@angular/core/testing'

import { DamageAnimationService } from './bird/damage-animation.service'

describe('DamageAnimationService', () => {
  let service: DamageAnimationService

  beforeEach(() => {
    TestBed.configureTestingModule({})
    service = TestBed.inject(DamageAnimationService)
  })

  it('should be created', () => {
    expect(service).toBeTruthy()
  })
})
