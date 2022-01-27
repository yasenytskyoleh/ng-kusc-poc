import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FooterPlayerWrapperComponent } from './footer-player-wrapper.component';

describe('FooterComponent', () => {
  let component: FooterPlayerWrapperComponent;
  let fixture: ComponentFixture<FooterPlayerWrapperComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FooterPlayerWrapperComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FooterPlayerWrapperComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
