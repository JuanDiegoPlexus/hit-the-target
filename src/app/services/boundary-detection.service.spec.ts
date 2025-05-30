import { TestBed } from '@angular/core/testing'

import { BoundaryDetectionService } from './boundary-detection.service'

describe('BoundaryDetectionService', () => {
  let service: BoundaryDetectionService

  beforeEach(() => {
    TestBed.configureTestingModule({})
    service = TestBed.inject(BoundaryDetectionService)
  })

  it('should be created', () => {
    expect(service).toBeTruthy()
  })
})
