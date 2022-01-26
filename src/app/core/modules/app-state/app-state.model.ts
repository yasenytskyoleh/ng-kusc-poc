import {PlayerState, PlayerStateStatus, Track} from '@shared/modules/player/models';
import {PlayerSource} from '@shared/models';

export class AppState {
  constructor(
    public currentTrack: Track | null = null,
    public currentAudioSource: PlayerSource = null,
    public playerState: PlayerState = {previous: null, current: 'initializing'},
  ) {
  }
}
