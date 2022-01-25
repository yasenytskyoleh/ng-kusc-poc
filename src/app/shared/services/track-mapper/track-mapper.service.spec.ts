import { TestBed } from '@angular/core/testing';

import { TrackMapperService } from './track-mapper.service';

describe('TrackMapperService', () => {
  let service: TrackMapperService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TrackMapperService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
