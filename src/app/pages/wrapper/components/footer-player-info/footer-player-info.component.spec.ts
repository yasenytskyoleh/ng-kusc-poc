import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FooterPlayerInfoComponent } from './footer-player-info.component';

describe('FooterPlayerInfoComponent', () => {
  let component: FooterPlayerInfoComponent;
  let fixture: ComponentFixture<FooterPlayerInfoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FooterPlayerInfoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FooterPlayerInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
