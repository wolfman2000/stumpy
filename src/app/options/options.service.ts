import { Injectable } from '@angular/core';

import { Mode } from './mode';
import { GlitchLogic } from './glitch-logic';

@Injectable()
export class OptionsService {
  constructor() {
    this.mode = Mode.Standard;
    this.logic = GlitchLogic.None;
  }

  private _mode: Mode;
  private _logic: GlitchLogic;

  get mode(): Mode {
    return this._mode;
  }
  set mode(mode: Mode) {
    this._mode = mode;
  }

  get modeKeys(): any {
    const results: Array<any> = [];
    for ( const member in Mode ) {
      if ( typeof Mode[member]  === 'number' ) {
        results.push({ label: member, value: Mode[member]});
      }
    }

    return results;
  }

  get modeString(): string {
    return Mode[this.mode];
  }

  get logic(): GlitchLogic {
    return this._logic;
  }
  set logic(logic: GlitchLogic) {
    this._logic = logic;
  }

  get logicKeys(): any {
    const results: Array<any> = [];
    for ( const member in GlitchLogic ) {
      if ( typeof GlitchLogic[member]  === 'number' ) {
        results.push({ label: member, value: GlitchLogic[member]});
      }
    }

    return results;
  }

  get logicString(): string {
    return GlitchLogic[this.logic];
  }
}
