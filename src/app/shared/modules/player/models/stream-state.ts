import {PlayerEvent} from './player';
import {PlayerState, PlayerStateStatus} from './player-state';
import {or} from '../../../helpers/functions/enum-fns';

export enum StreamState {
  Pause = 'LIVE_PAUSE',
  Playing = 'LIVE_PLAYING',
  Stop = 'LIVE_STOP',
  Failed = 'LIVE_FAILED',
  GettingStation = 'GETTING_STATION_INFORMATION',
  Buffering = 'LIVE_BUFFERING',
  Connecting = 'LIVE_CONNECTING',
  Reconnecting = 'LIVE_RECONNECTING',
  GeoBlocked = 'STREAM_GEO_BLOCKED',
  NotFound = 'STATION_NOT_FOUND',
  NotAllowed = 'PLAY_NOT_ALLOWED',
}

export interface StreamStateEventData {
  status: string;
  code: StreamState;
}

export type StreamStateEvent = PlayerEvent<StreamStateEventData>;


type GroupedStreamPlayerStatus = {
  [key in PlayerStateStatus]: (StreamState | null)[];
};

const groupedStatuses: Partial<GroupedStreamPlayerStatus> = {
  'loading': [StreamState.GettingStation, StreamState.Buffering, StreamState.Reconnecting, StreamState.Connecting],
  'play': [StreamState.Playing],
  'error': [StreamState.Failed, StreamState.NotFound, StreamState.NotAllowed, StreamState.GeoBlocked],
  'stop': [StreamState.Stop, StreamState.Pause, null],
}

export const getPlayerStateByStreamState = (status: StreamState | null): PlayerStateStatus => {
  const key = Object.keys(groupedStatuses).find((key ) => {
    const statuses = groupedStatuses[key as PlayerStateStatus];
    return statuses?.some(st => st === status);
  });
  return (key as PlayerStateStatus) || 'stop';
}
