import {Injectable} from '@angular/core';
import {TrackNowDto} from '../../models';
import {MomentService} from '../moment/moment.service';
import {Track, TrackCuePointEvent} from '../../modules/player/models';

@Injectable({
  providedIn: 'root'
})
export class TrackMapperService {

  constructor(
    private readonly momentService: MomentService,
  ) {
  }

  public mapTrackNow(track: TrackNowDto): Track {
    const {start, extraInfo, summary, end} = track;
    const {title, artist, Record_Company} = extraInfo;
    const dateTimeStart = this.momentService.getMomentDate(start.dateTime);
    const dateTimeEnd = this.momentService.getMomentDate(end.dateTime);
    const duration = this.momentService.getDatesDiffSeconds(dateTimeStart, dateTimeEnd);
    return new Track(duration, dateTimeStart, dateTimeEnd, title, artist, summary, Record_Company);
  }

  public mapTrackCuePoint(track: TrackCuePointEvent): Track {
    const {cueTimeStart, cueTimeDuration, cueTitle, artistName, parameters, albumName} = track.data.cuePoint;
    const timeStart = Number(cueTimeStart);
    const duration = Number(cueTimeDuration);
    const dateTimeStart = this.momentService.getMomentDate(timeStart);
    const dateTimeEnd =this.momentService.getMomentDate(timeStart + duration);
    const trackDuration = this.momentService.getDatesDiffSeconds(dateTimeStart, dateTimeEnd);
    return new Track(trackDuration, dateTimeStart, dateTimeEnd, cueTitle, artistName, parameters?.track_isrc, albumName);
  }
}

