import {Injectable} from '@angular/core';
import {
  SwUpdate,
  UnrecoverableStateEvent,
  UpdateActivatedEvent,
  UpdateAvailableEvent, ɵangular_packages_service_worker_service_worker_a
} from '@angular/service-worker';
import {Observable, Subject} from 'rxjs';
import {ServerSwUpdate} from '../models/server-sw-update.model';

@Injectable()
export class ServerSwUpdateService implements ServerSwUpdate {

  readonly available: Observable<UpdateAvailableEvent> =
    new Observable<UpdateAvailableEvent>((observer) => {
      observer.complete();
    });

  readonly activated: Observable<UpdateActivatedEvent> =
    new Observable<UpdateActivatedEvent>((observer) => {
      observer.complete();
    });

  readonly unrecoverable: Observable<UnrecoverableStateEvent> =
    new Observable<UnrecoverableStateEvent>((observer) => {
      observer.complete();
    });

  get isEnabled() {
    return false;
  }

  public checkForUpdate(): Promise<void> {
    return new Promise((resolve) => resolve());
  }

  public activateUpdate(): Promise<void> {
    return new Promise((resolve) => resolve());
  }
}

