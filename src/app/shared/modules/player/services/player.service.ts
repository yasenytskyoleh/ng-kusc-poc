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
import {BehaviorSubject, Observable, Subject} from 'rxjs';
import {DOCUMENT} from '@angular/common';
import {PlatformBrowserService} from '@core/modules/browser';
import {distinctUntilChanged, map} from 'rxjs/operators';
import {AppStateService} from '@core/modules/app-state';

declare const TDSdk: any;

@Injectable()
export class PlayerService {

  private currentVolume: number = 0;

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

  private playerInstanceState$: BehaviorSubject<PlayerState> = new BehaviorSubject<PlayerState>({
    previous: null,
    current: 'initializing'
  });

  private streamInstanceState$: BehaviorSubject<StreamState | null> = new BehaviorSubject<StreamState | null>(null);
  private streamFail$ = new Subject<boolean>();
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
  ) {
    this.renderer = rendererFactory.createRenderer(null, null);
    if (platformBrowserService.isBrowser) {
      this.initPlayerSDK(this.playerId);
    }
  }

  public destroy(): void {
    this.streamInstanceState$.complete();
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

  public play(station: string): void {
    this.stop();
    this.setVolume(this.currentVolume || .5);
    this.player.play({station, timeShifting: true});
    this.updatePlayerStatus('loading');
  }

  public stop(): void {
    this.player.stop();
    this.player.skipAd();
    this.updatePlayerStatus('stop');
  }

  public playAd(): void {
    this.stop();
    this.player.playAd(
      PlayerAdServerType.mediaAd,
      {
        mediaUrl: 'https://file-examples-com.github.io/uploads/2017/11/file_example_MP3_2MG.mp3',
        linkUrl: 'http://www.google.fr/'
      }
    );
    this.updatePlayerStatus('playAd');
  }

  public seek(): void {
    this.player.seek(-10);
  }

  private onPlayerReady(): void {
    this.updatePlayerStatus('ready');
    this.setVolume(this.currentVolume);
    // this.recentTracks();
    // this.nowPlayingApi();
  }

  //
  // private recentTracks(): void {
  //   this.player.NowPlayingApi.load({
  //     mount: 'SP_R3873504',
  //     hd: false,
  //     numberToFetch: 10,
  //     eventType: 'track',
  //   });
  // }

  public trackCuePoint(): void {
    const eventName = 'track-cue-point';
    this.player.addEventListener(eventName, (event: TrackCuePointEvent) => {
      const {data} = event;
      const {cuePoint} = data;
      const {cueTimeStart, cueTitle, artistName, parameters, albumName} = cuePoint;
      console.log(event);
      this.appStateService.currentTrack = new Track(cueTimeStart, cueTitle, artistName, parameters?.track_isrc, albumName);
    });
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

  // public nowPlayingApi(): Observable<TrackCuePoint[]> {
  //   const player = this.player;
  //   return new Observable<TrackCuePoint[]>(subscriber => {
  //     player.addEventListener('list-loaded', (event: TrackCuePointListEvent) => subscriber.next(event.data.list));
  //     player.addEventListener('list-empty', (event) => subscriber.next([]));
  //     player.addEventListener('nowplaying-api-error', (event) => subscriber.error(event));
  //   });
  // }

  public mute(): void {
    this.player.mute();
  }

  public unMute(): void {
    this.player.unMute();
  }

  public setVolume(volume: number): void {
    this.currentVolume = volume;
    if (volume < 0 || volume > 1) {
      return;
    }
    this.player.setVolume(volume);

    // if (volume <= 0) {
    // const minVolume = 0.000001;
    // volume = minVolume;
    // this.currentVolume = minVolume;
    // }
  }

  public updatePlayerStatus(newState: PlayerStateStatus): void {
    const {current} = this.playerInstanceState$.value;
    if (current === newState) {
      return;
    }
    this.playerInstanceState$.next({previous: current, current: newState});
  }

  private getCurrentPlayerStatus(): Observable<PlayerStateStatus> {
    return this.playerInstanceState$.asObservable().pipe(map(state => state.current), distinctUntilChanged())
  }

}
