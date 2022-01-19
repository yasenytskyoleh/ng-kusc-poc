import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {PlayerComponent} from './components/player/player.component';
import {VolumeControlComponent} from './components/volume-control/volume-control.component';


@NgModule({
  declarations: [
    PlayerComponent,
    VolumeControlComponent,
  ],
  imports: [
    CommonModule
  ],
  exports: [
    PlayerComponent,
  ],
})
export class PlayerModule {
}
