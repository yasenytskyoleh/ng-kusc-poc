import {TestBed} from '@angular/core/testing';

import {UniversalStorageService} from './universal-storage.service';

import SpyObj = jasmine.SpyObj;
import createSpyObj = jasmine.createSpyObj;
import {CookieService} from '@gorniv/ngx-universal';

describe('UniversalStorageService', () => {
  let service: UniversalStorageService;
  let cookieServiceSpy: SpyObj<CookieService>;

  const itemName = 'testItem';
  const itemValue = 'testValue';

  beforeEach(() => {
    const spy = createSpyObj('CookieService', ['removeAll', 'getAll', 'get', 'getAll', 'remove', 'put']);
    TestBed.configureTestingModule({
      providers: [
        UniversalStorageService,
        {provide: CookieService, useValue: spy}
      ]
    });

    service = TestBed.get(UniversalStorageService);
    cookieServiceSpy = TestBed.get(CookieService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('UniversalStorageService methods', () => {

    it('should put value to cookieService', () => {
      service.setItem(itemName, itemValue);
      expect(cookieServiceSpy.put.calls.count()).toBe(1, 'One call');
    });

  });
});
