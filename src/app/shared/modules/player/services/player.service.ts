import {Inject, Injectable, Renderer2, RendererFactory2} from '@angular/core';
import {
  PlayerAdServerType,
  PlayerState,
  StreamState,
  StreamStateEvent,
  TDPlayer,
  TDPlayerConfig,
  Track,
  TrackCuePoint,
  TrackCuePointEvent,
  TrackCuePointListEvent
} from '../models';
import {BehaviorSubject, Observable, Subject} from 'rxjs';
import {DOCUMENT} from '@angular/common';
import {PlatformBrowserService} from '@core/modules/browser';

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

  private playerInstanceState$: BehaviorSubject<PlayerState> = new BehaviorSubject<PlayerState>('initializing');
  private streamInstanceState$: BehaviorSubject<StreamState | null> = new BehaviorSubject<StreamState | null>(null);
  private currentTrackState$: Subject<Track | null> = new Subject<Track | null>();

  private renderer: Renderer2;

  public playerState$: Observable<PlayerState> = this.playerInstanceState$.asObservable();
  public streamState$: Observable<StreamState | null> = this.streamInstanceState$.asObservable();
  public currentTrack$: Observable<Track | null> = this.currentTrackState$.asObservable();
  private streamFail$ = new Subject<boolean>();
  public streamFailLoading$ = this.streamFail$.asObservable();

  constructor(
    private readonly rendererFactory: RendererFactory2,
    @Inject(DOCUMENT) private readonly document: Document,
    private readonly platformBrowserService: PlatformBrowserService,
  ) {
    this.renderer = rendererFactory.createRenderer(null, null);
    if (platformBrowserService.isBrowser) {
      this.initPlayerSDK('player-container-wrap');
    }
  }

  public init(): void {


  }

  public destroy(): void {
    this.streamInstanceState$.complete();
    // TODO: Check listeners removing
    this.player.stop();
    this.player?.destroyAd();
  }

  private addPlayerContainer(playerId: string): void {
    const div = this.renderer.createElement('div');
    this.renderer.setAttribute(div, 'id', playerId);
    if (this.document?.body) {
      this.renderer.appendChild(this.document.body, div);
    }
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
    console.log(tdPlayerConfig);
    this.player = new TDSdk(tdPlayerConfig);
    console.log(this.player);
    this.onStreamState();

    this.player.addEventListener('stream-fail', () => {
      this.streamFail$.next(true);
    });
  }

  public play(station: string): void {
    console.log(station);
    this.setVolume(this.currentVolume || .5);
    this.player.play({station, timeShifting: true});
  }

  public playAd(): void {
    this.player.playAd(
      PlayerAdServerType.mediaAd,
      {
        mediaUrl: 'https://file-examples-com.github.io/uploads/2017/11/file_example_MP3_2MG.mp3',
        linkUrl: 'http://www.google.fr/'
      }
    );
  }

  public seek(): void {
    this.player.seek(-10);
  }

  public stop(): void {
    this.player.stop();
  }

  private onPlayerReady(): void {
    this.playerInstanceState$.next('ready');
    this.onTrackCuePoint();
    this.setVolume(this.currentVolume);
    this.recentTracks();
    this.nowPlayingApi();
  }

  private recentTracks(): void {
    this.player.NowPlayingApi.load({
      mount: 'SP_R3873504',
      hd: false,
      numberToFetch: 10,
      eventType: 'track',
    });
  }

  private onTrackCuePoint(): void {
    const eventName = 'track-cue-point';
    this.player.addEventListener(eventName, (event: TrackCuePointEvent) => {
      const {data} = event;
      console.log(event);
      const {cuePoint} = data;
      const {cueTimeStart, cueTitle, artistName, parameters, albumName} = cuePoint;
      this.currentTrackState$.next(new Track(cueTimeStart, cueTitle, artistName, parameters?.track_isrc, albumName));
    });
  }

  private onConfigurationError(e): void {
    console.log('onConfigurationError', e);
    this.playerInstanceState$.next('error');
  }

  private onAdBlockerDetected(): void {
    console.log('onAdBlockerDetected');
  }

  private onModuleError(e: unknown): void {
    console.log('onModuleError', e);
    this.playerInstanceState$.next('error');
  }

  private onStreamState(): void {
    const eventName = 'stream-status';
    this.player.addEventListener(eventName, (event: StreamStateEvent) => {
      const state = event?.data?.code;
      this.streamInstanceState$.next(state);
    });
  }

  public nowPlayingApi(): Observable<TrackCuePoint[]> {
    const player = this.player;
    return new Observable<TrackCuePoint[]>(subscriber => {
      player.addEventListener('list-loaded', (event: TrackCuePointListEvent) => subscriber.next(event.data.list));
      player.addEventListener('list-empty', (event) => subscriber.next([]));
      player.addEventListener('nowplaying-api-error', (event) => subscriber.error(event));
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
    if (volume <= 0) {
      const minVolume = 0.000001;
      volume = minVolume;
      this.currentVolume = minVolume;
    }
    this.player.setVolume(volume);
  }

}
