import {Track} from '@shared/modules/player/models';

export class AppState {
  constructor(
    public currentTrack: Track | null = null,
  ) {
  }
}
