import { Component, Input } from '@angular/core';
import { Settings } from './settings';
import { Mode } from './mode';
import { GlitchLogic } from './glitch-logic';

@Component({
  selector: 'app-randomizer-settings',
  templateUrl: './settings.component.html'
})

export class RandomizerSettingsComponent {
  settings: Settings = {
    mode: Mode.Standard,
    logic: GlitchLogic.None
  };
  modeKeys(): Array<string> {
    const values: Array<string> = [];
    for ( let n in Mode ) {
        values.push( n );
    }

    return values;
  };
  currentLogic( l: GlitchLogic ): string {
    return GlitchLogic[l];
  };
  logicKeys(): any {
    let values: any = [];
    for ( let n in GlitchLogic ) {
      //  values.push( { id: n, value: GlitchLogic[n] } );
    values.push( n );
    }
    return values;
  };
}

