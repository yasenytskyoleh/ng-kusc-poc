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
import {combineLatest, Observable, Subject} from 'rxjs';
import {PlatformBrowserService} from '@core/modules/browser';
import {Router} from '@angular/router';
import {DestroySubscription} from '../../../../helpers/classes';
import {distinctUntilChanged, filter, map, takeUntil} from 'rxjs/operators';
import {isPlayingPlayer, PlayerStateStatus, Track} from '../../models';

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
    this.getPlayingState();
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

  private getPlayingState(): void {
    this.playerService.playerState$.pipe(
      map(state => isPlayingPlayer(state)),
      distinctUntilChanged(),
      takeUntil(this.destroyStream$)
    ).subscribe(isPlaying => {
      this.playing = isPlaying;
      this.playerPlayingChange.emit(isPlaying);
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
      takeUntil(this.destroyStream$),
    ).subscribe(_ => this.playerService.trackCuePoint());
  }

  private onStreamFail(): void {
    this.playerService.streamFailLoading$.pipe(
      takeUntil(this.destroyStream$),
    ).subscribe(() => {
      this.loading = true;
      this.playerService.updatePlayerStatus('fail');
      this.cdr.detectChanges();
      // this.intervalConnecting();
    });
  }

}
