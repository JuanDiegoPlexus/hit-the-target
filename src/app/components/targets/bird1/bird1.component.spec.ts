import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Bird1Component } from './bird1.component';

describe('Bird1Component', () => {
  let component: Bird1Component;
  let fixture: ComponentFixture<Bird1Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Bird1Component]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Bird1Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
