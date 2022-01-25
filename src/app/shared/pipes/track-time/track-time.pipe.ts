import {Pipe, PipeTransform} from '@angular/core';

@Pipe({
  name: 'trackTime',
  pure: true,
})
export class TrackTimePipe implements PipeTransform {

  transform(seconds: number): string {
    const minutes: number = Math.floor(seconds / 60);
    const minutesStr = minutes.toLocaleString('en-Us', {minimumIntegerDigits: 2});
    const secondsStr = (seconds - minutes * 60).toLocaleString('en-Us', {minimumIntegerDigits: 2});
    return `${minutesStr}:${secondsStr}`;
  }
}
