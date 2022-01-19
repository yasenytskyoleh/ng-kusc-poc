import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {AppComponent} from './app.component';
import {AppModule} from './app.module';
import {BrowserTransferStateModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {REQUEST} from '@nguniversal/express-engine/tokens';
import {StateTransferInitializerModule} from '@nguniversal/common';
import { ServiceWorkerModule } from '@angular/service-worker';
import { environment } from '../environments/environment';

export const getRequest = (): any => {
  return {headers: {cookie: document.cookie}};
};

@NgModule({
  imports: [
    AppModule,
    StateTransferInitializerModule,
    BrowserTransferStateModule,
    BrowserAnimationsModule,
    // ServiceWorkerModule.register('ngsw-worker.js', {
    //   enabled: environment.production,
    //   // Register the ServiceWorker as soon as the app is stable
    //   // or after 30 seconds (whichever comes first).
    //   registrationStrategy: 'registerWhenStable:30000'
    // }),
  ],
  providers: [
    {
      provide: REQUEST,
      useFactory: getRequest,
    },
    {provide: 'ORIGIN_URL', useValue: location.origin},
  ],
})
export class AppBrowserModule {
}
