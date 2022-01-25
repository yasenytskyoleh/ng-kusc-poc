import { TestBed } from '@angular/core/testing';

import { FooterPlayerWrapperService } from './footer-player-wrapper.service';

describe('FooterPlayerWrapperService', () => {
  let service: FooterPlayerWrapperService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FooterPlayerWrapperService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
