import {Component, OnDestroy, OnInit} from '@angular/core';
import {interval, merge, Observable, Subject} from 'rxjs';
import {distinctUntilChanged, map, startWith, switchMap, takeUntil, tap} from 'rxjs/operators';
import {DestroySubscription} from '../../../../helpers/classes';
import {AppStateService} from '@core/modules/app-state';
import {Track} from '../../../../modules/player/models';
import {PlatformBrowserService} from '@core/modules/browser';
import {FooterPlayerWrapperService} from '../../services/footer-player-wrapper.service';
import {PlayerSource, StationDto} from '../../../../models';

@Component({
  selector: 'app-footer-player-wrapper',
  templateUrl: './footer-player-wrapper.component.html',
  styleUrls: ['./footer-player-wrapper.component.scss']
})
export class FooterPlayerWrapperComponent extends DestroySubscription implements OnInit, OnDestroy {

  private readonly stopUpdateTracks$ = new Subject<void>();
  private readonly updateStationInfo$ = new Subject<boolean>();
  public currentTrack$: Observable<Track | null> | null = null;
  public currentSource$: Observable<PlayerSource> = this.appStateService.currentAudioSource$;
  public isBrowser: boolean;

  constructor(
    private readonly appStateService: AppStateService,
    private readonly platformBrowserService: PlatformBrowserService,
    private readonly footerPlayerWrapperService: FooterPlayerWrapperService,
  ) {
    super();
    this.isBrowser = platformBrowserService.isBrowser;
  }

  ngOnInit(): void {
    this.currentTrack$ = this.appStateService.currentTrack$.pipe(tap(state => console.log(state)));
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
      if (needUpdate) {
        this.getTrackCurrentPlay();
        return;
      }
      this.stopUpdateTracks$.next();
    });
  }

  private getTrackCurrentPlay(): void {
    const source = this.appStateService.currentAudioSource;
    if(!(source instanceof StationDto)){
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
