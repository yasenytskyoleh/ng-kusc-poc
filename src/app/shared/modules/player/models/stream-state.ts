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


const loadingStatuses: StreamState[] = [StreamState.GettingStation, StreamState.Buffering, StreamState.Reconnecting, StreamState.Connecting, StreamState.Failed];

export const isLoadingStream = (status: StreamState): boolean => loadingStatuses.includes(status);

export const isPlayStream = (status: StreamState): boolean => [StreamState.Playing].includes(status);

const failedStatuses = [StreamState.Failed, StreamState.NotFound, StreamState.NotAllowed, StreamState.GeoBlocked];

export const isFailedStream = (status: StreamState): boolean => failedStatuses.includes(status);

const stopStream = [StreamState.Stop, StreamState.Pause];

export const isStoppedStream = (status: StreamState): boolean => stopStream.includes(status);

type GroupedStreamPlayerStatus = {
  [key in PlayerStateStatus]: (StreamState | null)[];
};

const groupedStatuses: Partial<GroupedStreamPlayerStatus> = {
  'loading': [StreamState.GettingStation, StreamState.Buffering, StreamState.Reconnecting, StreamState.Connecting, StreamState.Failed],
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
