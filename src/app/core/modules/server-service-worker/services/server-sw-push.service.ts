import {Injectable} from '@angular/core';
import {NotificationClickEvent} from '../models/server-sw-push.model';
import {Observable} from 'rxjs';

@Injectable()
export class ServerSwPushService {

  readonly messages: Observable<object> =
    new Observable<object>((observer) => {
      observer.complete();
    });

  readonly notificationClicks: Observable<NotificationClickEvent> =
    new Observable<NotificationClickEvent>((observer) => {
      observer.complete();
    });

  readonly subscription: Observable<PushSubscription | null> =
    new Observable<PushSubscription>((observer) => {
      observer.complete();
    });

  get isEnabled(): boolean {
    return false;
  }

  public requestSubscription(options: {
    serverPublicKey: string;
  }): Promise<PushSubscription | null> {
    return new Promise((resolve) => resolve(null));
  }

  public unsubscribe(): Promise<void> {
    return new Promise((resolve) => resolve());
  }
}
