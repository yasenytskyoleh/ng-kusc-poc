import {ChangeDetectionStrategy, Component, Input, OnInit} from '@angular/core';
import {DemandTrackDto, StationDto} from '@shared/models';
import {Track} from '@shared/modules/player/models';

@Component({
  selector: 'app-footer-player-info',
  templateUrl: './footer-player-info.component.html',
  styleUrls: ['./footer-player-info.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FooterPlayerInfoComponent implements OnInit {

  @Input() station: StationDto | null = null;
  @Input() demandTrack: DemandTrackDto | null = null;
  @Input() currentTrack: Track | null = null;

  constructor() { }

  ngOnInit(): void {
  }

}
