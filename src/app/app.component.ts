import {Component, OnDestroy} from '@angular/core';
import {AppStateService} from '@core/modules/app-state';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnDestroy {

  constructor(
    private readonly appStateService: AppStateService,
  ) {

  }

  ngOnDestroy() {
    this.appStateService.destroyState();
  }
}
