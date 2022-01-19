import {UniversalStorageModule} from './modules/universal-storage';
import {NgModule, Optional, SkipSelf} from '@angular/core';
import {PlatformBrowserModule} from './modules/browser';

@NgModule({
  imports: [
    PlatformBrowserModule.forRoot(),
    UniversalStorageModule.forRoot(),
  ]
})
export class CoreModule {

  constructor(@Optional() @SkipSelf() parentModule: CoreModule) {
    if (parentModule) {
      throw new Error('CoreModule module should be imported only in AppModule.');
    }
  }

}
