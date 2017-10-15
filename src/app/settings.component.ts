import { Component, Input } from '@angular/core';
import { Settings } from './settings';
import { Mode } from './options/mode';
import { GlitchLogic } from './options/glitch-logic';
import { OptionsService } from './options/options.service';

@Component({
  providers: [OptionsService],
  selector: 'app-randomizer-settings',
  templateUrl: './settings.component.html'
})

export class RandomizerSettingsComponent {
  constructor(
    private _options: OptionsService
  ) {}
} /* istanbul ignore next */

