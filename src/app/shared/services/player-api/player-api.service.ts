import {Injectable} from '@angular/core';
import {Track} from '../../modules/player/models';
import {Observable, of} from 'rxjs';
import {HttpErrorResponse} from '@angular/common/http';
import {catchError, map} from 'rxjs/operators';
import {TransferHttpService} from '@gorniv/ngx-universal';
import {ISongs, ITrackDto, TrackListDto, TrackNowDto} from '../../models';
import {MomentService} from '../moment/moment.service';
import {TrackMapperService} from '../track-mapper/track-mapper.service';

@Injectable({
  providedIn: 'root'
})
export class PlayerApiService {

  constructor(
    private readonly http: TransferHttpService,
    private readonly momentService: MomentService,
    private readonly trackMapperService: TrackMapperService,
  ) {
  }

  public currentTrackNow(url: string): Observable<Track> {
    return this.http.get<TrackNowDto>(url).pipe(
      map((track: TrackNowDto) => this.trackMapperService.mapTrackNow(track)),
      catchError((err: HttpErrorResponse) => of(new Track())),
    );
  }

  // public trackList(url: string): Observable<Track[]> {
  //   return this.http.get<TrackListDto>(url).pipe(
  //     map((trackList: TrackListDto) => this.trackListReduce(trackList)),
  //     catchError((err: HttpErrorResponse) => of([])),
  //   );
  // }
  //
  // private trackListReduce(trackList: TrackListDto): Track[] {
  //   return trackList.reduce((accumulator: Track[], currentValue: ISongs<string>) => {
  //     currentValue.songs.forEach((track: ITrackDto<string>) => {
  //       return accumulator.push(this.trackForList(track));
  //     });
  //     return accumulator;
  //   }, []);
  // }
  //
  // private trackForList(track: ITrackDto<string>): Track {
  //   const slash = track?.extraInfo?.Conductor && track?.extraInfo?.Orchestra ? '/' : '';
  //   const {start, extraInfo, end} = track;
  //   const {title, artist, Soloist, Conductor, Orchestra, Record_Company, ISRC} = extraInfo;
  //   const perfomers = `${Soloist || ''} ${Conductor || ''} ${slash} ${Orchestra || ''}`;
  //   const catalog = ISRC || '';
  //   const recordCompany = Record_Company || '';
  //   return new Track(start, title, artist, perfomers, recordCompany, catalog);
  // }
}
