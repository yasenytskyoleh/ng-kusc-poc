import {Inject, Injectable} from '@angular/core';
import {BehaviorSubject, Observable} from 'rxjs';
import {PlatformBrowserService} from '../browser';
import {UniversalStorageService} from '../universal-storage';
import {AppState} from './app-state.model';
import {Track} from '@shared/modules/player/models';
import {pluck} from 'rxjs/operators';

@Injectable()
export class AppStateService {

  public state$: Observable<AppState>;
  private state: BehaviorSubject<AppState>;

  public get isBrowser(): boolean {
    return this.browserService.isBrowser;
  }

  public set currentTrack(track: Track | null) {
    this.setStateProperty('currentTrack', track);
  }

  public get currentTrack(): Track | null {
    return this.getStateProperty('currentTrack') as Track | null;
  }

  public get currentTrack$(): Observable<Track | null> {
    return this.state$.pipe(
      pluck('currentTrack')
    );
  }

  constructor(
    private readonly browserService: PlatformBrowserService,
    @Inject(UniversalStorageService) private readonly universalStorageService: UniversalStorageService,
  ) {
    const state = new AppState();
    this.state = new BehaviorSubject<AppState>(state);
    this.state$ = this.state.asObservable();
  }

  protected getState(): AppState {
    return {...this.state.value};
  }

  protected setState(state: AppState): void {
    this.state.next(state);
  }

  private setStateProperty(key: keyof AppState, value: AppState[keyof AppState]): void {
    const state = this.getState();
    (state as any)[key] = value as any;
    this.setState(state);
  }

  private getStateProperty(key: keyof AppState): AppState[keyof AppState] {
    const state = this.getState();
    return state[key] || null;
  }

  public destroyState(): void {
    this.state.complete();
  }

}
