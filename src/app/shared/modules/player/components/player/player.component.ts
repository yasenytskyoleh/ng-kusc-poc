import {
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  Output,
  SimpleChanges
} from '@angular/core';
import {PlayerService} from '../../services/player.service';
import {Subject} from 'rxjs';
import {PlatformBrowserService} from '@core/modules/browser';
import {Router} from '@angular/router';
import {DestroySubscription} from '../../../../helpers/classes';
import {distinctUntilChanged, filter, map, pairwise, takeUntil} from 'rxjs/operators';
import {getPlayerStateByStreamState, isPlayingPlayer, PlayerStateStatus, showPlayerLoader} from '../../models';

@Component({
  selector: 'app-player',
  templateUrl: './player.component.html',
  styleUrls: ['./player.component.scss'],
  providers: [
    PlayerService,
  ],
})
export class PlayerComponent extends DestroySubscription implements OnInit, OnChanges, OnDestroy {

  public static nextId = 0;
  public readonly id = `player-container-${PlayerComponent.nextId++}`;

  @Input() station: string | null = null;
  @Output() playerPlayingChange = new EventEmitter<boolean>();


  public loading: boolean = false;
  public playing = false;
  public isMuted = false;

  private readonly trackUpdate$ = new Subject<void>();
  // private readonly recentTracksUpdate$ = new Subject<void>();
  private readonly currentStation$ = new Subject<string>();
  // private isListeningTracked$ = new BehaviorSubject<boolean>(true);
  // private readonly destroyTracked$ = new Subject<void>();
  // private readonly stopUpdatesTracks$ = new Subject<void>();
  // private readonly destroyIntervalConnecting$ = new Subject<void>();
  // private recentTracks$ = this.recentTracksUpdate$.asObservable();

  private statuses = {current: null, previous: null};


  constructor(
    private readonly playerService: PlayerService,
    private readonly cdr: ChangeDetectorRef,
    private readonly router: Router,
    private readonly platformBrowserService: PlatformBrowserService,
  ) {
    super();
  }

  ngOnChanges(changes: SimpleChanges) {
    const station = this.station;
    if ('station' in changes && station) {
      this.currentStation$.next(station);
    }
  }

  ngOnInit(): void {
    this.trackCuePoint();
    this.onStreamFail();
    this.onPlayerStateChanges();
    this.onStreamStateChanges();
    this.getLoadingState();
    this.stateLogs();
  }

  ngOnDestroy() {
    super.ngOnDestroy();
    this.playerService.destroy();
  }

  public playHandler(event: MouseEvent): void {
    event?.preventDefault();
    event?.stopPropagation();
    const station = this.station;
    if (!station) {
      return;
    }
    const player = this.playerService;
    if (!this.playing) {
      player.play(station);
      return;
    }
    player.stop();
  }

  public playAdHandler(event: MouseEvent): void {
    event?.preventDefault();
    event?.stopPropagation();
    if (this.playing) {

    }
    this.playerService.playAd();
  }

  public stopAdHandler(): void {
    this.playerService.stop();
  }


  private onStreamStateChanges(): void {
    this.playerService.streamState$.pipe(
      distinctUntilChanged(),
      takeUntil(this.destroyStream$)
    ).subscribe((streamState) => {
      const playerState = getPlayerStateByStreamState(streamState);
      if (!playerState) {
        return;
      }
      const currentPlayerStatus = this.playerService.playerCurrentState;
      if (currentPlayerStatus === 'playAd') {
        return;
      }
      this.playerService.updatePlayerStatus(playerState);
    });
  }

  private onPlayerStateChanges(): void {
    this.playerService.playerState$.pipe(
      distinctUntilChanged(),
      takeUntil(this.destroyStream$)
    ).subscribe(state => {
      // console.log(state);
      this.updatePlayStatus(state);
      this.updateLoadingStatus(state);
    });
  }

  private updatePlayStatus(status: PlayerStateStatus): void {
    const isPlaying = isPlayingPlayer(status);
    this.playing = isPlaying;
    this.playerPlayingChange.emit(isPlaying);
    console.log(this.playing);
    this.cdr.detectChanges();
  }

  private updateLoadingStatus(status: PlayerStateStatus): void {
    this.loading = showPlayerLoader(status);
    this.cdr.detectChanges();
  }

  private getLoadingState(): void {
    this.playerService.playerState$.pipe(
      map((playerState) => showPlayerLoader(playerState)),
      takeUntil(this.destroyStream$),
    ).subscribe(vl => {
      this.loading = vl;
      this.cdr.detectChanges();
    });
  }

  public onChangeVolume(event: number): void {
    const volume = +event;
    this.isMuted = volume === 0;
    this.playerService.setVolume(+event);
  }

  public loadingClickHandler(event: MouseEvent): void {
    event?.preventDefault();
    event?.stopPropagation();
  }


  private trackCuePoint(): void {
    this.playerService.playerState$.pipe(
      filter(state => state === 'ready'),
      distinctUntilChanged(),
      takeUntil(this.destroyStream$),
    ).subscribe(_ => this.playerService.trackCuePoint());
  }

  private onStreamFail(): void {
    this.playerService.streamFailLoading$.pipe(
      takeUntil(this.destroyStream$),
    ).subscribe(() => {
      console.log('fail');
      this.loading = true;
      this.playerService.updatePlayerStatus('fail');
      this.cdr.detectChanges();
      // this.intervalConnecting();
    });
  }

  private stateLogs(): void {
    this.playerService.streamState$.pipe(
      pairwise(),
      takeUntil(this.destroyStream$)
    ).subscribe(([prev, curr]) => {
      console.log('prev ---', prev, 'curr ---', curr)
    });
  }

}
