import { Injectable } from '@angular/core';

import { LocalStorageService } from '../local-storage.service';

import { Difficulty } from './difficulty';
import { Mode } from './mode';
import { GlitchLogic } from './glitch-logic';

@Injectable()
export class SettingsService {
  constructor(
    private localStorageService: LocalStorageService
  ) {
    if ( !this.localStorageService.hasItem( 'mode' ) ) {
      this.mode = Mode.Standard;
    } else {
      this._mode = parseInt( localStorage.getItem( 'mode' ), 10 );
    }

    if ( !this.localStorageService.hasItem( 'difficulty' ) ) {
      this.difficulty = Difficulty.Normal;
    } else {
      this._difficulty = parseInt( localStorage.getItem( 'difficulty' ), 10 );
    }

    if ( !this.localStorageService.hasItem( 'logic' ) ) {
      this.logic = GlitchLogic.None;
    } else {
      this._logic = parseInt( localStorage.getItem( 'logic' ), 10 );
    }
  }

  private _mode: Mode;
  private _logic: GlitchLogic;
  private _difficulty: Difficulty;

  get mode(): Mode {
    return this._mode;
  }
  set mode(mode: Mode) {
    this._mode = parseInt( mode + '', 10 );
    this.localStorageService.setItem( 'mode', this.mode + '' );
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

  get difficulty(): Difficulty {
    return this._difficulty;
  }
  set difficulty(difficulty: Difficulty) {
    this._difficulty = parseInt( difficulty + '', 10 );
    this.localStorageService.setItem( 'difficulty', this.difficulty + '' );
  }

  get difficultyKeys(): any {
    const results: Array<any> = [];
    for ( const member in Difficulty ) {
      if ( typeof Difficulty[member]  === 'number' ) {
        results.push({ label: member, value: Difficulty[member]});
      }
    }

    return results;
  }

  get logic(): GlitchLogic {
    return this._logic;
  }
  set logic(logic: GlitchLogic) {
    this._logic = parseInt( logic + '', 10 );
    this.localStorageService.setItem( 'logic', this.logic + '' );
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

  isExpertOrInsane(): boolean {
    return this._difficulty === Difficulty.Expert || this._difficulty === Difficulty.Insane;
  }
}
