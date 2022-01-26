import {Injectable} from '@angular/core';
import {StationApiService} from '../../../services/station-api/station-api.service';
import {Observable, of} from 'rxjs';
import {Track} from '../../../modules/player/models';
import {catchError, map} from 'rxjs/operators';
import {TrackNowDto} from '../../../models';
import {HttpErrorResponse} from '@angular/common/http';
import {MomentService} from '../../../services/moment/moment.service';
import {TrackMapperService} from '../../../services/track-mapper/track-mapper.service';

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
