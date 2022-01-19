import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {SwPush, SwUpdate} from '@angular/service-worker';
import {ServerSwPushService} from './services/server-sw-push.service';
import {ServerSwUpdateService} from './services/server-sw-update.service';


@NgModule({
  declarations: [],
  imports: [
    CommonModule
  ],
  providers: [
    ServerSwPushService,
    ServerSwUpdateService,
    {
      provide: SwPush,
      useClass: ServerSwPushService
    },
    {
      provide: SwUpdate,
      useClass: ServerSwUpdateService
    }
  ]
})
export class ServerServiceWorkerModule {
}
