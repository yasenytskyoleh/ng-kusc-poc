import {Pipe, PipeTransform} from '@angular/core';

@Pipe({
  name: 'trackTime',
  pure: true,
})
export class TrackTimePipe implements PipeTransform {

  transform(seconds: number | null): string {
    const value = seconds || 0;
    const minutes: number = Math.floor(value / 60);
    const minutesStr = minutes.toLocaleString('en-Us', {minimumIntegerDigits: 2});
    const secondsStr = (value - minutes * 60).toLocaleString('en-Us', {minimumIntegerDigits: 2});
    return `${minutesStr}:${secondsStr}`;
  }
}
