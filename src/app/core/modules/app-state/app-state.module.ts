import {ModuleWithProviders, NgModule, Optional, SkipSelf} from '@angular/core';
import {PlatformBrowserService} from '../browser';
import {UniversalStorageService} from '../universal-storage';
import {AppStateService} from './app-state.service';

export function appStateServiceFactory(
  platformBrowserService: PlatformBrowserService,
  universalStorageService: UniversalStorageService,
): AppStateService {
  console.log('create');
  return new AppStateService(platformBrowserService, universalStorageService);
}

@NgModule()
export class AppStateModule {

  constructor(@Optional() @SkipSelf() parentModule: AppStateModule) {
    if (parentModule) {
      throw new Error('AppStateModule module should be imported only in CoreModule.');
    }
  }

  public static forRoot(): ModuleWithProviders<AppStateModule> {
    return {
      ngModule: AppStateModule,
      providers: [
        {
          provide: AppStateService,
          useFactory: appStateServiceFactory,
          deps: [PlatformBrowserService, UniversalStorageService]
        }
      ]
    };
  }
}
