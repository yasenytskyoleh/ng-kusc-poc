import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {TrackTimePipe} from './track-time.pipe';


@NgModule({
  declarations: [
    TrackTimePipe
  ],
  imports: [
    CommonModule
  ],
  exports: [
    TrackTimePipe,
  ],
})
export class TrackTimeModule {
}
