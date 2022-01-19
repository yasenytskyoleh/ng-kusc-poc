import {ModuleWithProviders, NgModule, Optional, SkipSelf} from '@angular/core';
import {CookieModule, CookieService} from '@gorniv/ngx-universal';
import {UniversalStorageService} from './universal-storage.service';

export function universalStorageServiceFactory(cookieService: CookieService): UniversalStorageService {
  return new UniversalStorageService(cookieService);
}

@NgModule({
  imports: [
    CookieModule.forChild(),
  ]
})
export class UniversalStorageModule {

  constructor(@Optional() @SkipSelf() parentModule: UniversalStorageModule) {
    if (parentModule) {
      throw new Error('UniversalStorageModule module should be imported only in CoreModule.');
    }
  }

  public static forRoot(): ModuleWithProviders<UniversalStorageModule> {
    return {
      ngModule: UniversalStorageModule,
      providers: [
        {
          provide: UniversalStorageService,
          useFactory: universalStorageServiceFactory,
          deps: [CookieService]
        }
      ]
    };
  }
}
