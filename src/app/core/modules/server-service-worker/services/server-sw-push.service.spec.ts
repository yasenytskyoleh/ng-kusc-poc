import { TestBed } from '@angular/core/testing';

import { ServerSwPushService } from './server-sw-push.service';

describe('ServerSwPushService', () => {
  let service: ServerSwPushService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ServerSwPushService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
