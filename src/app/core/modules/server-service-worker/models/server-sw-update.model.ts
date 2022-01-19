import {UnrecoverableStateEvent, UpdateActivatedEvent, UpdateAvailableEvent} from '@angular/service-worker';
import {Observable} from 'rxjs';

export interface ServerSwUpdate {
  /**
   * Emits an `UpdateAvailableEvent` event whenever a new app version is available.
   */
  readonly available: Observable<UpdateAvailableEvent>;
  /**
   * Emits an `UpdateActivatedEvent` event whenever the app has been updated to a new version.
   */
  readonly activated: Observable<UpdateActivatedEvent>;
  /**
   * Emits an `UnrecoverableStateEvent` event whenever the version of the app used by the service
   * worker to serve this client is in a broken state that cannot be recovered from without a full
   * page reload.
   */
  readonly unrecoverable: Observable<UnrecoverableStateEvent>;

  /**
   * True if the Service Worker is enabled (supported by the browser and enabled via
   * `ServiceWorkerModule`).
   */
  isEnabled: boolean;

  checkForUpdate(): Promise<void>;

  activateUpdate(): Promise<void>;
}
