import {Injectable} from '@angular/core';
import {AppStateService} from '@core/modules/app-state';
import {Observable} from 'rxjs';
import {map} from 'rxjs/operators';
import {isPlayerLoading, isPlayingPlayer} from '@shared/modules/player/models';

@Injectable()
export class StubService {

  constructor(
    private readonly appStateService: AppStateService,
  ) {
  }

  public isPlayerLoading$(): Observable<boolean> {
    return this.appStateService.playerState$.pipe(map(state => isPlayerLoading(state.current)));
  }

  public isPlayerPlaying(): Observable<boolean> {
    return this.appStateService.playerState$.pipe(map(state => isPlayingPlayer(state.current)));
  }
}
