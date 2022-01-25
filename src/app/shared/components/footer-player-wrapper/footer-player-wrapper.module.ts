import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FooterPlayerWrapperComponent} from './components/footer-player-wrapper/footer-player-wrapper.component';
import {PlayerModule} from '../../modules/player/player.module';
import {FooterPlayerWrapperService} from './services/footer-player-wrapper.service';
import {TrackTimeModule} from '../../pipes/track-time/track-time.module';


@NgModule({
  declarations: [
    FooterPlayerWrapperComponent
  ],
  imports: [
    CommonModule,
    PlayerModule,
    TrackTimeModule,
  ],
  providers: [
    FooterPlayerWrapperService,
  ],
  exports: [FooterPlayerWrapperComponent],
})
export class FooterPlayerWrapperModule {
}
