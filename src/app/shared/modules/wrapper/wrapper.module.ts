import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {WrapperComponent} from './components/wrapper/wrapper.component';
import {FooterPlayerWrapperModule} from '../../components/footer-player-wrapper';
import {RouterModule} from '@angular/router';


@NgModule({
  declarations: [
    WrapperComponent
  ],
  imports: [
    CommonModule,
    FooterPlayerWrapperModule,
    RouterModule,
  ],
  exports: [
    WrapperComponent,
  ],
})
export class WrapperModule {
}
