import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PauseTabComponent } from './pause-tab.component';

describe('PauseTabComponent', () => {
  let component: PauseTabComponent;
  let fixture: ComponentFixture<PauseTabComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PauseTabComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(PauseTabComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
