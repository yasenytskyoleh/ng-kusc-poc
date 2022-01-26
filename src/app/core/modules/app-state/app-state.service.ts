import {Inject, Injectable} from '@angular/core';
import {BehaviorSubject, Observable} from 'rxjs';
import {PlatformBrowserService} from '../browser';
import {UniversalStorageService} from '../universal-storage';
import {AppState} from './app-state.model';
import {isPlayerLoading, isPlayingPlayer, PlayerState, Track} from '@shared/modules/player/models';
import {distinctUntilChanged, map, pluck, shareReplay, tap} from 'rxjs/operators';
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

  public set currentAudioSource(track: PlayerSource) {
    this.setStateProperty('currentAudioSource', track);
  }

  public get currentAudioSource(): PlayerSource {
    return this.getStateProperty('currentAudioSource') as PlayerSource;
  }

  public get currentAudioSource$(): Observable<PlayerSource> {
    return this.state$.pipe(
      pluck('currentAudioSource')
    );
  }

  public set playerState(playerState: PlayerState) {

    console.log('set player state', playerState);
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
    console.log(state);
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
    console.log(state.currentTrack, key, value);
    (state as any)[key] = value as any;
   this.setState(state);
    console.log(state.currentTrack);
  }

  public setStateProperties(values: Partial<AppState>): void {
    console.log(values);
    const state = this.getState();
    const newState = {...state, ...values};
    this.setState(newState);
    console.log(this.getState().currentTrack);
  }

  private getStateProperty(key: keyof AppState): AppState[keyof AppState] {
    const state = this.getState();
    return state[key] || null;
  }

  public destroyState(): void {
    this.state.complete();
  }

}
