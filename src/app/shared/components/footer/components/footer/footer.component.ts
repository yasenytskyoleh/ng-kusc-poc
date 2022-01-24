import {Component, OnDestroy, OnInit} from '@angular/core';
import {PlayerApiService} from '../../../../services/player-api/player-api.service';
import {interval, merge, Observable, Subject} from 'rxjs';
import {startWith, switchMap, takeUntil, tap} from 'rxjs/operators';
import {DestroySubscription} from '../../../../helpers/classes';
import {StationApiService} from '../../../../services/station-api/station-api.service';
import {AppStateService} from '@core/modules/app-state';
import {Track} from '../../../../modules/player/models';
import Platform = NodeJS.Platform;
import {PlatformBrowserService} from '@core/modules/browser';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss']
})
export class FooterComponent extends DestroySubscription implements OnInit, OnDestroy {

  public readonly stationName = 'CC2_S01';
  private readonly stopUpdateTracks$ = new Subject<void>();
  public currentTrack$: Observable<Track | null> = this.appStateService.currentTrack$;
  public isBrowser: boolean;

  constructor(
    private readonly playerApiService: PlayerApiService,
    private readonly stationApiService: StationApiService,
    private readonly appStateService: AppStateService,
    private readonly platformBrowserService: PlatformBrowserService,
  ) {
    super();
    this.isBrowser = platformBrowserService.isBrowser;
  }

  ngOnInit(): void {
  }

  ngOnDestroy() {
    super.ngOnDestroy();
    this.stopUpdateTracks$.next();
    this.stopUpdateTracks$.complete();
  }


  public onPlayerStateChange(isPlaying: boolean): void {
    if (isPlaying) {
      this.stopUpdateTracks$.next();
      return;
    }
    this.getTrackCurrentPlay();
  }

  private getTrackCurrentPlay(): void {
    const destroyStream$ = merge(this.destroyStream$, this.stopUpdateTracks$);
    const interval$ = interval(1000 * 60);
    interval$.pipe(
      startWith(null),
      switchMap(_ => this.stationApiService.getStationCurrentTrack(this.stationName)),
      takeUntil(destroyStream$),
    ).subscribe((track) => {
      this.appStateService.currentTrack = track;
    });
  }
}
