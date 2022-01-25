import {DemandTrackDto, StationDto} from '../models';

export const STATIONS: StationDto[] = [
  new StationDto(
    "The Holiday Spirit Channel",
    "CC2_S01",
    "https://images.prismic.io/dev-cc/5048a680-af65-4342-8b56-80006c885469_HSC_Thumbnail.png?auto=compress,format",
    "https://schedule.kusc.org/v2/songs/CC2_S01/now",
    "https://schedule.kusc.org/v2/songs/CC2_S01/recent?combinedFormat=true&reversed=true",
  ),
  new StationDto(
    "Classical KDFC",
    "KDFCFM",
    "https://images.prismic.io/dev-cc/785277bf-a18d-419c-b77c-16e4828e178a_img_kdfc.png?auto=compress,format",
    "https://schedule.kusc.org/v2/songs/KDFCFM/now",
    "https://schedule.kusc.org/v2/songs/KDFCFM/recent?combinedFormat=true&reversed=true",
  ),
];


export const DEMAND_TRACKS: DemandTrackDto[] = [
  new DemandTrackDto(
    'https://file-examples-com.github.io/uploads/2017/11/file_example_MP3_2MG.mp3',
    'test audio file',
    52,
  ),
  new DemandTrackDto(
    'https://file-examples-com.github.io/uploads/2017/11/file_example_MP3_5MG.mp3',
    'test audio file 2',
    132,
  ),
]
