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
import {DestroySubscription} from '../../../../helpers/classes';
import {distinctUntilChanged, filter, pairwise, switchMap, takeUntil} from 'rxjs/operators';
import {getPlayerStateByStreamState, isPlayerLoading, isPlayingPlayer, PlayerStateStatus} from '../../models';
import {PlayerSource} from '../../../../models';
import {fromEvent} from 'rxjs';

@Component({
  selector: 'app-player',
  templateUrl: './player.component.html',
  styleUrls: ['./player.component.scss'],
  providers: [
    PlayerService,
  ]
})
export class PlayerComponent extends DestroySubscription implements OnInit, OnChanges, OnDestroy {

  @Input() source: PlayerSource | null = null;
  @Output() updateStationInfo = new EventEmitter<boolean>(true);


  public loading: boolean = false;
  public playing = false;
  public isMuted = false;

  constructor(
    private readonly playerService: PlayerService,
    private readonly cdr: ChangeDetectorRef,
  ) {
    super();
    this.playerService.init();
  }

  ngOnChanges(changes: SimpleChanges) {
  }

  ngOnInit(): void {
    this.trackCuePoint();
    this.onStreamFail();
    this.onPlayerStateChanges();
    this.onStreamStateChanges();
    this.stateLogs();
  }

  ngOnDestroy() {
    super.ngOnDestroy();
    this.playerService.destroy();
  }

  public playHandler(event: MouseEvent): void {
    event?.preventDefault();
    event?.stopPropagation();
    const source = this.playerService.audioSource;
    if (!source || this.loading) {
      return;
    }
    const player = this.playerService;
    if (!this.playing) {
      player.play(source);
      return;
    }
    player.stop();
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
      this.updatePlayerStatuses(state);
      this.cdr.detectChanges();
    });
  }

  private updatePlayerStatuses(state: PlayerStateStatus): void {
    this.playing = isPlayingPlayer(state);
    this.loading = isPlayerLoading(state);
    const update =  state === 'stop';
    this.updateStationInfo.emit(update);
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
      switchMap(_ => this.playerService.getTrackPoint()),
      takeUntil(this.destroyStream$),
    ).subscribe(track => {
      this.playerService.setTrackToStorage(track);
      this.cdr.detectChanges();
    });
  }

  private onStreamFail(): void {
    this.playerService.streamFailLoading$.pipe(
      takeUntil(this.destroyStream$),
    ).subscribe(() => {
      this.playerService.updatePlayerStatus('fail');
      this.cdr.detectChanges();
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
