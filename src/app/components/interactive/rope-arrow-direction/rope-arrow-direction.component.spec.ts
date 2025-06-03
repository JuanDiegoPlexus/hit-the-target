import { ComponentFixture, TestBed } from '@angular/core/testing'

import { RopeArrowDirectionComponent } from './rope-arrow-direction.component'

describe('RopeArrowDirectionComponent', () => {
  let component: RopeArrowDirectionComponent
  let fixture: ComponentFixture<RopeArrowDirectionComponent>

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RopeArrowDirectionComponent],
    }).compileComponents()

    fixture = TestBed.createComponent(RopeArrowDirectionComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
