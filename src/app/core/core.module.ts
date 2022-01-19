import {UniversalStorageModule} from './modules/universal-storage';
import {NgModule, Optional, SkipSelf} from '@angular/core';
import {PlatformBrowserModule} from './modules/browser';
import {AppStateModule} from './modules/app-state';

@NgModule({
  imports: [
    PlatformBrowserModule.forRoot(),
    UniversalStorageModule.forRoot(),
    AppStateModule.forRoot(),
  ]
})
export class CoreModule {

  constructor(@Optional() @SkipSelf() parentModule: CoreModule) {
    if (parentModule) {
      throw new Error('CoreModule module should be imported only in AppModule.');
    }
  }

}
