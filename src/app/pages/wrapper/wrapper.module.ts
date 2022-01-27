import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {WrapperComponent} from './components/wrapper/wrapper.component';
import {WrapperRoutingModule} from './wrapper-routing.module';
import {FooterPlayerWrapperComponent} from './components/footer-player-wrapper/footer-player-wrapper.component';
import {FooterPlayerWrapperService} from './services/footer-player-wrapper.service';
import {TrackTimeModule} from '@shared/pipes/track-time/track-time.module';
import {PlayerModule} from '@shared/modules/player';
import { FooterPlayerInfoComponent } from './components/footer-player-info/footer-player-info.component';


@NgModule({
  declarations: [
    WrapperComponent,
    FooterPlayerWrapperComponent,
    FooterPlayerInfoComponent,
  ],
  imports: [
    CommonModule,
    WrapperRoutingModule,
    TrackTimeModule,
    PlayerModule,
  ],
  providers: [
    FooterPlayerWrapperService,
  ],
})
export class WrapperModule {
}
