import { TestBed } from '@angular/core/testing';

import { AppStateService } from './app-state.service';
import { LocalStorageService } from '../local-storage';
import { PlatformBrowserService } from '../browser';
import { UniversalStorageService } from '../universal-storage';

import SpyObj = jasmine.SpyObj;
import createSpyObj = jasmine.createSpyObj;



describe('AppStateService', () => {
  let service: AppStateService;
  let localStorageService: SpyObj<LocalStorageService>;
  let browserService: SpyObj<PlatformBrowserService>;
  let universalStorage: SpyObj<UniversalStorageService>;

  beforeEach(() => {
    const localStorageSpy = createSpyObj('LocalStorageService', ['getItem, setItem']);
    const browserSpy = createSpyObj('PlatformBrowserService', ['isBrowser']);
    const universalSpy = createSpyObj('UniversalStorageService', ['getItem']);

    TestBed.configureTestingModule({
      providers: [
        AppStateService,
        { provide:  LocalStorageService, useValue: localStorageSpy },
        { provide:  PlatformBrowserService, useValue: browserSpy },
        { provide:  UniversalStorageService, useValue: universalSpy },
      ]
    });

    service = TestBed.get(AppStateService);
    localStorageService = TestBed.get(LocalStorageService);
    browserService = TestBed.get(PlatformBrowserService);
    universalStorage = TestBed.get(UniversalStorageService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should destroyState', (done: DoneFn) => {
    service.destroyState();
    service.state$.subscribe(
      () => {},
      () => {},
      () => done
    );
  });
});
