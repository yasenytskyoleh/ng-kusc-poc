import {Track} from '@shared/modules/player/models';
import {PlayerSource} from '@shared/models';

export class AppState {
  constructor(
    public currentTrack: Track | null = null,
    public currentAudioSource: PlayerSource = null,
  ) {
  }
}
