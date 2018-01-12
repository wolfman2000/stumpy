import { Component, OnInit } from '@angular/core';
import { SettingsService } from './settings.service';

import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'stumpy-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.css']
})

export class SettingsComponent implements OnInit {
  /* istanbul ignore next */
  constructor(
    private _options: SettingsService,
    private _modalService: NgbModal
  ) {}

  options: SettingsService;

  /* istanbul ignore next */
  ngOnInit(): void {
    this.options = this._options;
  }

  /* istanbul ignore next */
  open( content: any ): void {
    this._modalService.open( content );
  }

  saveMode( evt: Event, value: any ): void {
    this._options.mode = value;
  }

  saveGoal( evt: Event, value: any ): void {
    this._options.goal = value;
  }

  saveDifficulty( evt: Event, value: any ): void {
    this._options.difficulty = value;
  }

  saveItemShuffle( evt: Event, value: any ): void {
    this._options.itemShuffle = value;
  }

  saveGoMode( evt: Event, value: any ): void {
    this._options.showGoMode = value;
  }

  saveEnemy( evt: Event, value: any ): void {
    this._options.enemy = value;
  }
}

