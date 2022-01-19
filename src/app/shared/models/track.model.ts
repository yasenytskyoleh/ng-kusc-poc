export interface ITrackDto<T> {
  readonly end: T;
  readonly extraInfo: IInfoTrack;
  readonly start: T;
  readonly summary: string;
  readonly created?: string;
  readonly description?: string;
  readonly eventType?: string;
  readonly id?: string;
  readonly updated?: string;
}

export type TrackNowDto = ITrackDto<ITimeTrack>;
export type TrackListDto = ISongs<string>[];

export interface ISongs<T>{
  readonly songs: ITrackDto<T>[];
}

export interface ITimeTrack {
  readonly dateTime: string;
  readonly timeZone: string;
}

export interface IInfoTrack {
  readonly Composer: string;
  readonly Conductor: string;
  readonly ISRC: string;
  readonly Orchestra: string;
  readonly Record_Company: string;
  readonly Soloist: string;
  readonly artist: string;
  readonly title: string;
  readonly MM_ID?: string;
  readonly Spine_Number?: string;
  readonly air_time?: string;
  readonly cart?: string;
  readonly category?: string;
  readonly duration?: string;
  readonly end?: string;
  readonly intro?: string;
  readonly media_type?: string;
  readonly milliseconds_left?: string;
  readonly sched_time?: string;
  readonly stack_pos?: string;
  readonly station?: string;
  readonly trivia?: string;
}
