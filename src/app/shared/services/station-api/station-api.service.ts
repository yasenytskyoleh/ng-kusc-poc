import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {TransferHttpService} from '@gorniv/ngx-universal';
import {TrackNowDto} from '../../models';

@Injectable({
  providedIn: 'root'
})
export class StationApiService {

  private apiUrl = 'https://schedule.kusc.org/v2/songs';

  constructor(
    private readonly http: TransferHttpService,
  ) {
  }

  public getStationCurrentTrack(stationName: string): Observable<TrackNowDto> {
    return this.http.get<TrackNowDto>(`${this.apiUrl}/${stationName}/now`);
  }
}
