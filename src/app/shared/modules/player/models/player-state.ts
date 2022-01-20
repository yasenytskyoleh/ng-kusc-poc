export type PlayerStateStatus = 'initializing' | 'ready' | 'play' | 'playAd' | 'stop' | 'error' | 'fail';


export interface PlayerState {
  previous: PlayerStateStatus | null;
  current: PlayerStateStatus;
}


export const isPlayingPlayer = (status: PlayerStateStatus): boolean => status === 'play' || status === 'playAd';
