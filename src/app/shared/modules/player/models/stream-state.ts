import {PlayerEvent} from './player';

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

