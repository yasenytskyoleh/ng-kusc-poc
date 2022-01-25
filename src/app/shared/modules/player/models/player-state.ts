export type PlayerStateStatus = 'initializing' | 'ready' | 'loading' | 'play' | 'playAd' | 'stop' | 'error' | 'fail';


export interface PlayerState {
  previous: PlayerStateStatus | null;
  current: PlayerStateStatus;
}

export const isPlayingPlayer = (status: PlayerStateStatus): boolean => status === 'play' || status === 'playAd';

export const isPlayerLoading = (status: PlayerStateStatus): boolean => ['loading'].includes(status);


