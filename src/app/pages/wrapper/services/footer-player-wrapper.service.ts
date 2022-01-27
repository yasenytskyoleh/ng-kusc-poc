import {Injectable} from '@angular/core';
import {StationApiService} from '@shared/services/station-api/station-api.service';
import {Observable, of} from 'rxjs';
import {Track} from '@shared/modules/player/models';
import {catchError, map} from 'rxjs/operators';
import {TrackNowDto} from '@shared/models';
import {HttpErrorResponse} from '@angular/common/http';
import {MomentService} from '@shared/services/moment/moment.service';
import {TrackMapperService} from '@shared/services/track-mapper/track-mapper.service';
import {AppStateService} from '@core/modules/app-state';

@Injectable()
export class FooterPlayerWrapperService {

  constructor(
    private readonly stationApiService: StationApiService,
    private readonly trackMapperService: TrackMapperService,
  ) {
  }

  public getTrackNow(stationName: string): Observable<Track> {
    return this.stationApiService.getStationCurrentTrack(stationName).pipe(
      map((track: TrackNowDto) => this.trackMapperService.mapTrackNow(track)),
      catchError((err: HttpErrorResponse) => of(new Track())),
    )
  }
}
