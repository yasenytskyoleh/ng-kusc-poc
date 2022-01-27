import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  Output,
  SimpleChanges
} from '@angular/core';
import {DestroySubscription} from '@shared/helpers/classes';
import {Track} from '@shared/modules/player/models';
import {PlatformBrowserService} from '@core/modules/browser';
import {DemandTrackDto, PlayerSource, StationDto} from '@shared/models';

@Component({
  selector: 'app-footer-player-wrapper',
  templateUrl: './footer-player-wrapper.component.html',
  styleUrls: ['./footer-player-wrapper.component.scss'],
})
export class FooterPlayerWrapperComponent extends DestroySubscription implements OnInit, OnChanges, OnDestroy {

  @Input() currentTrack: Track | null = null;
  @Input() currentSource: PlayerSource | null = null;
  @Output() updateStationInfo = new EventEmitter<boolean>();


  public station: StationDto | null = null;
  public demandTrack: DemandTrackDto | null = null;
  public isBrowser: boolean;

  constructor(
    private readonly platformBrowserService: PlatformBrowserService,
  ) {
    super();
    this.isBrowser = platformBrowserService.isBrowser;
  }

  ngOnChanges(changes: SimpleChanges) {
    const currentSource = this.currentSource;
    if ('currentSource' in changes && currentSource) {
      if (currentSource instanceof StationDto) {
        this.station = {...currentSource};
        console.log(this.station);
        this.demandTrack = null;
      }
      if (currentSource instanceof DemandTrackDto) {
        this.demandTrack = {...currentSource};
        this.station = null;
      }
    }
    if ('currentTrack' in changes) {
      console.log(this.currentTrack);
    }
  }

  ngOnInit(): void {

  }

  public onUpdateStationInfo(needUpdate: boolean): void {
    this.updateStationInfo.emit(needUpdate);
  }

}
