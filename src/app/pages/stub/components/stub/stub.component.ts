import {Component, OnInit} from '@angular/core';
import {DEMAND_TRACKS, STATIONS} from '@shared/static/mock-player-data';
import {PlayerService} from '@shared/modules/player/services/player.service';
import {AppStateService} from '@core/modules/app-state';
import {PlayerSource, StationDto} from '@shared/models';
import {Observable} from 'rxjs';
import {shareReplay, tap} from 'rxjs/operators';
import {StubService} from '../../services/stub.service';
import {Track} from '@shared/modules/player/models';

@Component({
  selector: 'app-stub',
  templateUrl: './stub.component.html',
  styleUrls: ['./stub.component.scss']
})
export class StubComponent implements OnInit {

  public stations = STATIONS;
  public demandTracks = DEMAND_TRACKS;
  public currentSource$: Observable<PlayerSource>;
  public isPlayerPlay$: Observable<boolean>;

  constructor(
    private readonly appStateService: AppStateService,
    private readonly stubService: StubService,
  ) {
    this.currentSource$ = this.appStateService.currentAudioSource$.pipe(shareReplay(1));
    this.isPlayerPlay$ = this.stubService.isPlayerPlaying();
  }

  ngOnInit(): void {
  }

  public onPlay(source: PlayerSource): void {
    this.appStateService.currentAudioSource = source;
  }
}
