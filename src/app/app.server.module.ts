import {NgModule} from '@angular/core';
import {ServerModule, ServerTransferStateModule} from '@angular/platform-server';

import {AppModule} from './app.module';
import {AppComponent} from './app.component';
import {NoopAnimationsModule} from '@angular/platform-browser/animations';
import {ServerServiceWorkerModule} from './core/modules/server-service-worker';
import {UNIVERSAL_LOCATION} from './core/tokens/universal-location';
import {CookieBackendService, CookieService} from '@gorniv/ngx-universal';

@NgModule({
  imports: [
    AppModule,
    ServerModule,
    NoopAnimationsModule,
    ServerTransferStateModule,
    ServerServiceWorkerModule,
  ],
  bootstrap: [AppComponent],
  providers: [
    {
      provide: CookieService,
      useClass: CookieBackendService
    },
    UNIVERSAL_LOCATION,
  ]
})
export class AppServerModule {
}
