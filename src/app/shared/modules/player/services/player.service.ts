import {Inject, Injectable, Renderer2, RendererFactory2} from '@angular/core';
import {
  PlayerAdServerType,
  PlayerState,
  PlayerStateStatus,
  StreamState,
  StreamStateEvent,
  TDPlayer,
  TDPlayerConfig,
  Track,
  TrackCuePointEvent
} from '../models';
import {BehaviorSubject, fromEvent, Observable, Subject} from 'rxjs';
import {DOCUMENT} from '@angular/common';
import {PlatformBrowserService} from '@core/modules/browser';
import {distinctUntilChanged, map, takeUntil} from 'rxjs/operators';
import {AppStateService} from '@core/modules/app-state';
import {TrackMapperService} from '../../../services/track-mapper/track-mapper.service';
import {DemandTrackDto, PlayerSource, StationDto} from '../../../models';

declare const TDSdk: any;

@Injectable()
export class PlayerService {

  private currentVolume: number = .5;

  private playerInstance: TDPlayer | undefined;

  private get player(): TDPlayer {
    const player = this.playerInstance;
    if (!player) {
      throw new Error('Player is not defined');
    }
    return player;
  }

  private set player(player: TDPlayer) {
    this.playerInstance = player;
  }

  public get volume(): number {
    return this.player.getVolume();
  }

  public get playerCurrentState(): PlayerStateStatus {
    return this.playerInstanceState$.value.current;
  }

  public get audioSource(): PlayerSource {
    return this.appStateService.currentAudioSource;
  }

  private playerInstanceState$: BehaviorSubject<PlayerState> = new BehaviorSubject<PlayerState>({
    previous: null,
    current: 'initializing'
  });

  private streamInstanceState$: BehaviorSubject<StreamState | null> = new BehaviorSubject<StreamState | null>(null);
  private streamFail$ = new Subject<boolean>();
  private destroyStream$ = new Subject<boolean>();
  private renderer: Renderer2;
  private readonly playerId = 'player-container-wrap';

  public playerState$: Observable<PlayerStateStatus> = this.getCurrentPlayerStatus();
  public streamState$: Observable<StreamState | null> = this.streamInstanceState$.asObservable();
  public streamFailLoading$: Observable<boolean> = this.streamFail$.asObservable();

  constructor(
    private readonly rendererFactory: RendererFactory2,
    @Inject(DOCUMENT) private readonly document: Document,
    private readonly platformBrowserService: PlatformBrowserService,
    private readonly appStateService: AppStateService,
    private readonly trackMapperService: TrackMapperService,
  ) {
    this.renderer = rendererFactory.createRenderer(null, null);
    if (platformBrowserService.isBrowser) {
      this.initPlayerSDK(this.playerId);
    }
  }

  public init(): void {
    this.appStateService.currentAudioSource$.pipe(
      distinctUntilChanged(),
      takeUntil(this.destroyStream$)
    ).subscribe((source) => {
      const playerState = this.playerCurrentState;
      if (!source || playerState === 'initializing') {
        return;
      }
      this.appStateService.currentTrack = null;
      this.play(source);
    })
  }

  public destroy(): void {
    this.streamInstanceState$.complete();
    this.destroyStream$.next();
    this.destroyStream$.complete();
    this.streamFail$.complete();
    // TODO: Check listeners removing
    this.player.stop();
    this.removePlayerContainer(this.playerId);
    this.player.destroy();
    this.player.destroyAd();
  }

  private addPlayerContainer(playerId: string): void {
    const div = this.renderer.createElement('div');
    this.renderer.setAttribute(div, 'id', playerId);
    const body = this.document.body;
    this.renderer.appendChild(body, div);
  }

  private removePlayerContainer(playerId: string): void {
    const body = this.document.body;
    const player = body.querySelector(`${playerId}`);
    if (!player) {
      return;
    }
    this.renderer.removeChild(body, player);
  }

  private initPlayerSDK(playerId: string): void {
    this.addPlayerContainer(playerId);
    const tdPlayerConfig: TDPlayerConfig = {
      coreModules: [
        {
          id: 'MediaPlayer',
          playerId,
          plugins: [
            {id: 'mediaAd'}
          ]
        },
        {id: 'NowPlayingApi'},
      ],
      playerReady: () => this.onPlayerReady(),
      configurationError: (e) => this.onConfigurationError(e),
      moduleError: (e) => this.onModuleError(e),
      adBlockerDetected: () => this.onAdBlockerDetected(),
    };
    this.player = new TDSdk(tdPlayerConfig);
    this.onStreamStateChange();

    this.player.addEventListener('stream-fail', () => {
      this.streamFail$.next(true);
    });
  }

  public play(source: PlayerSource): void {
    this.setVolume(this.currentVolume || .5);
    if (source instanceof StationDto) {
      this.player.skipAd();
      this.playStation(source.stationName);
      return;
    }
    if (source instanceof DemandTrackDto) {
      this.player.stop();
      this.playAd(source);
    }
  }

  private playStation(station: string): void {
    const nowPlaying = this.playerCurrentState === 'play';
    nowPlaying ? this.player.stop() : this.player.skipAd();
    this.updatePlayerStatus('loading');
    setTimeout(() => this.player.play({station, timeShifting: true}), 100);
  }

  public stop(): void {
    this.player.stop();
    this.player.skipAd();
    this.updatePlayerStatus('stop');
  }

  public playAd(source: DemandTrackDto): void {
    const {url, artist, duration, trackName} = source;
    this.player.stop();
    this.player.playAd(
      PlayerAdServerType.mediaAd,
      {mediaUrl: url}
    );
    const currentTrack = new Track(duration, null, null, trackName, artist);
    const {current} = this.playerInstanceState$.value;
    const playerState: PlayerState = {previous: current, current: 'playAd'};
    this.appStateService.setStateProperties({playerState, currentTrack});
    this.playerInstanceState$.next(playerState);
  }


  private onPlayerReady(): void {
    this.updatePlayerStatus('ready');
    this.setVolume(this.currentVolume);
  }

  public getTrackPoint(): Observable<Track> {
    const eventName = 'track-cue-point';
    return fromEvent(this.player, eventName).pipe(
      map(event => this.trackMapperService.mapTrackCuePoint(event))
    )
  }

  public setTrackToStorage(track: Track): void {
    this.appStateService.currentTrack = track;
  }

  // TODO: add type
  private onConfigurationError(e: any): void {
    console.log('onConfigurationError', e);
    this.updatePlayerStatus('error');
  }

  private onAdBlockerDetected(): void {
    console.log('onAdBlockerDetected');
  }

  private onModuleError(e: unknown): void {
    console.log('onModuleError', e);
    this.updatePlayerStatus('error');
  }

  private onStreamStateChange(): void {
    const eventName = 'stream-status';
    this.player.addEventListener(eventName, (event: StreamStateEvent) => {
      const state = event?.data?.code;
      this.streamInstanceState$.next(state);
    });
  }

  public mute(): void {
    this.player.mute();
  }

  public unMute(): void {
    this.player.unMute();
  }

  public setVolume(volume: number): void {
    this.currentVolume = volume;
    if (volume > 1) {
      return;
    }
    console.log(volume);
    if (volume <= 0) {
      const minVolume = 0.000001;
      volume = minVolume;
      this.currentVolume = minVolume;
    }

    this.player.setVolume(volume);
  }

  public updatePlayerStatus(newState: PlayerStateStatus): void {
    const {current} = this.playerInstanceState$.value;
    if (current === newState) {
      return;
    }
    const state: PlayerState = {previous: current, current: newState};
    this.playerInstanceState$.next(state);
    this.appStateService.playerState = state;
  }

  private getCurrentPlayerStatus(): Observable<PlayerStateStatus> {
    return this.playerInstanceState$.asObservable().pipe(map(state => state.current), distinctUntilChanged())
  }

}
