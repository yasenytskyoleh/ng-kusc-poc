import { TestBed } from '@angular/core/testing';

import { ServerSwUpdateService } from './server-sw-update.service';

describe('ServerSwUpdateService', () => {
  let service: ServerSwUpdateService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ServerSwUpdateService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
