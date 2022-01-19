import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {WrapperComponent} from './components/wrapper/wrapper.component';
import {FooterModule} from '../../components/footer';
import {RouterModule} from '@angular/router';


@NgModule({
  declarations: [
    WrapperComponent
  ],
  imports: [
    CommonModule,
    FooterModule,
    RouterModule,
  ],
  exports: [
    WrapperComponent,
  ],
})
export class WrapperModule {
}
