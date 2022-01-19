import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FooterComponent} from './components/footer/footer.component';
import {PlayerModule} from '../../modules/player/player.module';


@NgModule({
  declarations: [
    FooterComponent
  ],
  imports: [
    CommonModule,
    PlayerModule,
  ],
  exports: [FooterComponent],
})
export class FooterModule {
}
