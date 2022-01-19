export type PlayerStateStatus = 'initializing' | 'ready' | 'play' | 'stop' | 'error' | 'fail';


export interface PlayerState {
  previous: PlayerStateStatus | null;
  current: PlayerStateStatus;
}
