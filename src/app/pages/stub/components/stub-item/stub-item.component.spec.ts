import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StubItemComponent } from './stub-item.component';

describe('StubItemComponent', () => {
  let component: StubItemComponent;
  let fixture: ComponentFixture<StubItemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StubItemComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(StubItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
