import {Injectable} from '@angular/core';
import {Observable, of} from 'rxjs';
import {Track} from '../../modules/player/models';
import {TransferHttpService} from '@gorniv/ngx-universal';
import {catchError, map} from 'rxjs/operators';
import {TrackNowDto} from '../../models';
import {HttpErrorResponse} from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class StationApiService {

  private apiUrl = 'https://schedule.kusc.org/v2/songs';

  constructor(
    private readonly http: TransferHttpService,
  ) {
  }

  public getStationCurrentTrack(stationName: string): Observable<Track> {
    return this.http.get<TrackNowDto>(`${this.apiUrl}/${stationName}/now`).pipe(
      map((track: TrackNowDto) => {
          const {start, extraInfo, summary} = track;
          const {title, artist, Record_Company} = extraInfo;
          return new Track(start?.dateTime, title, artist, summary, Record_Company);
        }
      ),
      catchError((err: HttpErrorResponse) => of(new Track())),
    );
  }
}
