export enum PlayerAdServerType {
  vastAd = 'vastAd',
  tap = 'tap',
  mediaAd = 'mediaAd',
}


export interface TDPlayerBasePlayOptions {
  timeShifting?: boolean;
  connectionTimeOut?: number;
  trackingParameters?: { [key: string]: unknown}
}

export interface TDPlayerStationPlayOptions extends TDPlayerBasePlayOptions{
  station: string;
}

export interface TDPlayerMountPlayOptions extends TDPlayerBasePlayOptions{
  station: string;
}

export type TDPlayerPlayOptions  = TDPlayerStationPlayOptions | TDPlayerMountPlayOptions;

export interface NowPlayerApiParams {
  mount: string;
  hd: boolean;
  numberToFetch: number;
  eventType?: string;
}

export interface NowPlayingApi {
  load: (params: NowPlayerApiParams) => any;
  start: () => void;
}

export interface TDPlayer {
  MediaElement: unknown;
  MediaPlayer: unknown;
  abBlockProcessFinish: boolean;
  destroy: () => void;
  destroyAd: () => void;
  getVolume: () => number;
  initMediaElement: () => void;
  listeners: EventListenerOrEventListenerObject[];
  loadModulesCalled: boolean;
  moduleManager: unknown;
  mute: () => void;
  pause: () => void;
  play: (options: TDPlayerPlayOptions) => void;
  playAd: (adServerType: PlayerAdServerType, config: PlayerAdConfig) => void;
  reloadSyncBanner: () => void;
  restartConnectionTimeOut: () => void;
  resume: () => void;
  seek: (duration: number) => void;
  seekLive: () => void;
  setVolume: (volume: number) => void;
  skipAd: () => void;
  stop: () => void;
  target: unknown;
  unMute: () => void;
  NowPlayingApi: NowPlayingApi;

  addEventListener: (event: string, cb: (event: PlayerEvent<any>) => void) => unknown;
  removeEventListener: (event: string, listener: unknown) => void;
}

export interface PlayerTapAdConfig {
  host: string;
  type: string;
  format?: string;
  stationName: string;
  stationId: number;
  maxAds?: number;
  assetType?: string;
  minFileSize?: number;
  maxFileSize?: number;
  fileFormat?: string;
  minDuration?: number;
  maxDuration?: number;
  minBitrate?: number;
  maxBitrate?: number;
  minWidth?: number;
  maxWidth?: number;
  minHeight?: number;
  maxHeight?: number;
  audioCodec?: string;
  audioMinChannels?: number;
  audioMaxChannels?: number;
  audioSampleRates?: string;
  videoCodec?: string;
  videoAspectRatio?: string;
  minFrameRate?: number;
  maxFrameRate?: number;
  excludedCategories?: string;
}

export interface PlayerMediaAdConfig {
  mediaUrl: string;
  linkUrl: string;
}

export interface PlayerVastAdConfig {
  url: string;
}

export interface PlayerBloomAdConfig {
  id: string;
}

export type PlayerAdConfig = PlayerTapAdConfig | PlayerMediaAdConfig | PlayerVastAdConfig;

export interface TDPlayerCoreModule {
  id: string;
  playerId?: string;

  [key: string]: any;
}

export interface TDPlayerConfig {
  coreModules: TDPlayerCoreModule[];
  playerReady: () => void;
  configurationError: (error: unknown) => void;
  moduleError: (error: unknown) => void;
  adBlockerDetected: () => void;
}

export interface TrackCuePointParameters {
  cue_time_duration: string;
  cue_time_start: string;
  cue_title: string;
  track_album_name: string;
  track_album_publisher: string;
  track_artist_name: string;
  // track_cover_url: string;
  track_id: string;
  track_isrc: string;
}

export interface TrackCuePoint {
  albumName: string;
  artistName: string;
  coverURL: string;
  cueTimeDuration: string;
  cueTimeStart: string;
  cueTitle: string;
  mount: string;
  parameters: TrackCuePointParameters;
  timestamp: number;
  trackID: string;
  type: string;
}

export interface TrackCuePointEventData {
  cuePoint: TrackCuePoint;
}

export interface TrackCuePointListEventData {
  list: TrackCuePoint[];
}

export interface PlayerEvent<T> {
  bubbles: boolean;
  cancelable: boolean;
  data: T;
}

export type TrackCuePointEvent = PlayerEvent<TrackCuePointEventData>;

export type TrackCuePointListEvent = PlayerEvent<TrackCuePointListEventData>;


export interface PlayerListeners {
  event: string;
  listener: unknown;
}

export class Track {
  constructor(
    public readonly time: string | null = '',
    public readonly title: string | null = '',
    public readonly artist: string | null = '',
    public readonly perfomers: string | null = '',
    public readonly recordCompany: string | null = '',
    public readonly catalog: string | null = '',
  ) {
  }
}

export class TrackerResponse {
  constructor(
    public readonly time: number,
    public readonly guid: string,
  ) {
  }
}
