import {Component, OnInit} from '@angular/core';
import {PlayerSource, StationDto} from '@shared/models';
import {STATIONS} from '@shared/static/mock-player-data';
import {ActivatedRoute, Router} from '@angular/router';
import {Observable} from 'rxjs';
import {shareReplay} from 'rxjs/operators';
import {AppStateService} from '@core/modules/app-state';
import {StubService} from '../../services/stub.service';

@Component({
  selector: 'app-stub-item',
  templateUrl: './stub-item.component.html',
  styleUrls: ['./stub-item.component.scss']
})
export class StubItemComponent implements OnInit {

  public station: StationDto | null = null;
  public currentSource$: Observable<PlayerSource>;
  public isPlayerPlay$: Observable<boolean>;

  constructor(
    private readonly activatedRoute: ActivatedRoute,
    private readonly router: Router,
    private readonly appStateService: AppStateService,
    private readonly stubService: StubService,
  ) {
    this.currentSource$ = this.appStateService.currentAudioSource$.pipe(shareReplay(1));
    this.isPlayerPlay$ = this.stubService.isPlayerPlaying();
  }

  ngOnInit(): void {
    const station = this.getStationByUrl();
    if (!station) {
      this.router.navigate(['../']);
      return;
    }
    this.station = station;
  }

  public onPlay(source: PlayerSource): void {
    this.appStateService.currentAudioSource = source;
  }

  private getStationByUrl(): StationDto | null {
    const stationName = this.activatedRoute.snapshot.params.stationName;
    if (!stationName) {
      return null;
    }
    return STATIONS.find(st => st.stationName === stationName) || null;
  }

}
