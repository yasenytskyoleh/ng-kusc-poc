import {Component, OnDestroy, OnInit} from '@angular/core';
import {AppStateService} from '@core/modules/app-state';
import {StationDto} from '@shared/models';
import {interval, merge, Subject} from 'rxjs';
import {distinctUntilChanged, startWith, switchMap, takeUntil} from 'rxjs/operators';
import {DestroySubscription} from '@shared/helpers/classes';
import {FooterPlayerWrapperService} from '../../services/footer-player-wrapper.service';

@Component({
  selector: 'app-wrapper',
  templateUrl: './wrapper.component.html',
  styleUrls: ['./wrapper.component.scss']
})
export class WrapperComponent extends DestroySubscription implements OnInit, OnDestroy {

  public currentTrack$ = this.appStateService.currentTrack$;
  public currentSource$ = this.appStateService.currentAudioSource$;
  private readonly stopUpdateTracks$ = new Subject<void>();
  private readonly updateStationInfo$ = new Subject<boolean>();

  constructor(
    private readonly appStateService: AppStateService,
    private readonly footerPlayerWrapperService: FooterPlayerWrapperService,
  ) {
    super();
  }

  ngOnInit(): void {
    this.handleUpdateCurrentTrack();
  }


  ngOnDestroy() {
    super.ngOnDestroy();
    this.stopUpdateTracks$.next();
    this.stopUpdateTracks$.complete();
    this.updateStationInfo$.complete();
  }

  public onUpdateStationInfo(needUpdate: boolean): void {
    this.updateStationInfo$.next(needUpdate);
  }

  private handleUpdateCurrentTrack(): void {
    this.updateStationInfo$.pipe(
      distinctUntilChanged(),
      takeUntil(this.destroyStream$)
    ).subscribe(needUpdate => {
      console.log('need update', needUpdate);
      if (needUpdate) {
        this.getTrackCurrentPlay();
        return;
      }
      this.stopUpdateTracks$.next();
    });
  }

  private getTrackCurrentPlay(): void {
    const source = this.appStateService.currentAudioSource;
    if (!(source instanceof StationDto)) {
      return
    }
    const destroyStream$ = merge(this.destroyStream$, this.stopUpdateTracks$);
    const interval$ = interval(1000 * 60);
    interval$.pipe(
      startWith(null),
      switchMap(_ => this.footerPlayerWrapperService.getTrackNow(source.stationName)),
      takeUntil(destroyStream$),
    ).subscribe((track) => {
      this.appStateService.currentTrack = track;
    });
  }

}
