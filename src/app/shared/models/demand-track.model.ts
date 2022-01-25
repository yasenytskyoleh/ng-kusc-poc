export class DemandTrackDto {
  constructor(
    public readonly url: string,
    public readonly trackName: string,
    public readonly duration: number,
    public readonly artist: string | null = null,
  ) {
  }
}
