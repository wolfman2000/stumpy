import { Component, Input, OnInit } from '@angular/core';
import { Mode } from './mode';
import { GlitchLogic } from './glitch-logic';
import { SettingsService } from './settings.service';

@Component({
  selector: 'app-randomizer-settings',
  templateUrl: './settings.component.html'
})

export class RandomizerSettingsComponent implements OnInit {
  /* istanbul ignore next */
  constructor(
    private _options: SettingsService
  ) {}

  options: SettingsService;

  /* istanbul ignore next */
  ngOnInit(): void {
    this.options = this._options;
  }
}

