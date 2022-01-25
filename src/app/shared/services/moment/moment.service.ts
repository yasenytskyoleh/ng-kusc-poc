import {Injectable} from '@angular/core';
import * as moment from 'moment';
import {Moment} from 'moment';

export enum MomentFormats {
  DATE_TIME = 'YYYY-MM-DD HH:mm',
}

@Injectable({
  providedIn: 'root'
})
export class MomentService {

  public getMomentDate(date: Moment | string | number | null): Moment {
    return moment(date);
  }

  public getFormattedDate(date: Moment | string | number | null, format: MomentFormats): string {
    return moment(date).format(format);
  }

  constructor() {
  }

  public getDatesDiffSeconds(
    dateTimeStart: Moment | string | null,
    dateTimeEnd: Moment | string | null
  ): number {
    if (!dateTimeStart || !dateTimeEnd) {
      return 0;
    }
    const startDate = this.getMomentDate(dateTimeStart).millisecond(0);
    const endDate = this.getMomentDate(dateTimeEnd).millisecond(0);
    return endDate.diff(startDate, 'seconds');
  }
}
