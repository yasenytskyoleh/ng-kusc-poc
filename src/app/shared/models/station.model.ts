export class StationDto {
  constructor(
    public readonly stationPlayerName: string,
    public readonly stationName: string,
    public readonly stationThumbnailUrl: string,
    public readonly currentTrackUrl: string,
    public readonly recentTracksUrl: string,
  ) {
  }

}
