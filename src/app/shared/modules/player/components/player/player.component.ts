import {Component, OnInit} from '@angular/core';
import {PlayerService} from '../../services/player.service';

@Component({
  selector: 'app-player',
  templateUrl: './player.component.html',
  styleUrls: ['./player.component.scss'],
  providers: [
    PlayerService,
  ],
})
export class PlayerComponent implements OnInit {

  constructor() {
  }

  ngOnInit(): void {
  }

}
