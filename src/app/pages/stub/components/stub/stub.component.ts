import {Component, OnInit} from '@angular/core';
import {DEMAND_TRACKS, STATIONS} from '@shared/static/mock-player-data';
import {PlayerService} from '@shared/modules/player/services/player.service';
import {AppStateService} from '@core/modules/app-state';
import {StationDto} from '@shared/models';

@Component({
  selector: 'app-stub',
  templateUrl: './stub.component.html',
  styleUrls: ['./stub.component.scss']
})
export class StubComponent implements OnInit {

  public stations = STATIONS;
  public demandTracks = DEMAND_TRACKS;

  constructor(
    private readonly appStateService: AppStateService,
  ) {
  }

  ngOnInit(): void {
  }

  public onPlay(station: StationDto): void {
    this.appStateService.currentAudioSource = station;
  }
}
