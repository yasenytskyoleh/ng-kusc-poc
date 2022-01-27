import {Inject, Injectable} from '@angular/core';
import {BehaviorSubject, Observable} from 'rxjs';
import {PlatformBrowserService} from '../browser';
import {UniversalStorageService} from '../universal-storage';
import {AppState} from './app-state.model';
import {PlayerState, Track} from '@shared/modules/player/models';
import {distinctUntilChanged, map, pluck, shareReplay} from 'rxjs/operators';
import {PlayerSource} from '@shared/models';

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
      map(state => state.currentTrack),
    );
  }

  public set currentAudioSource(currentAudioSource: PlayerSource) {
    this.setStateProperty('currentAudioSource', currentAudioSource);
  }

  public get currentAudioSource(): PlayerSource {
    return this.getStateProperty('currentAudioSource') as PlayerSource;
  }

  public get currentAudioSource$(): Observable<PlayerSource> {
    return this.state$.pipe(
      pluck('currentAudioSource'),
      distinctUntilChanged(),
    );
  }

  public set playerState(playerState: PlayerState) {
    this.setStateProperty('playerState', playerState);
  }

  public get playerState(): PlayerState {
    return this.getStateProperty('playerState') as PlayerState;
  }

  public get playerState$(): Observable<PlayerState> {
    return this.state$.pipe(
      pluck('playerState'),
      distinctUntilChanged(),
    );
  }

  constructor(
    private readonly browserService: PlatformBrowserService,
    @Inject(UniversalStorageService) private readonly universalStorageService: UniversalStorageService,
  ) {
    const state = new AppState();
    this.state = new BehaviorSubject<AppState>(state);
    this.state$ = this.state.asObservable().pipe(shareReplay(1));
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

  public setStateProperties(values: Partial<AppState>): void {
    const state = this.getState();
    const newState = {...state, ...values};
    this.setState(newState);
  }

  private getStateProperty(key: keyof AppState): AppState[keyof AppState] {
    const state = this.getState();
    return state[key] || null;
  }

  public destroyState(): void {
    this.state.complete();
  }

}
