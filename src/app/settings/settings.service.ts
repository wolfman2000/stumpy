import { Injectable } from '@angular/core';

import { LocalStorageService } from '../local-storage.service';
import { WordSpacingPipe } from '../word-spacing.pipe';

import { Difficulty } from './difficulty';
import { Goal } from './goal';
import { Mode } from './mode';
import { GlitchLogic } from './glitch-logic';

@Injectable()
export class SettingsService {
  constructor(
    private localStorageService: LocalStorageService,
    private wordSpacingPipe: WordSpacingPipe
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

    if ( !this.localStorageService.hasItem( 'showGoMode' ) ) {
      this.showGoMode = 0;
    } else {
      this._showGoMode = parseInt( localStorage.getItem( 'showGoMode' ), 10 );
    }

    if ( !this.localStorageService.hasItem( 'goal' ) ) {
      this.goal = Goal.Ganon;
    } else {
      this._goal = parseInt( localStorage.getItem( 'goal' ), 10 );
    }
  }

  private _mode: Mode;
  private _logic: GlitchLogic;
  private _difficulty: Difficulty;
  private _showGoMode: number;
  private _goal: Goal;

  get mode(): Mode {
    return this._mode;
  }
  set mode(mode: Mode) {
    this._mode = parseInt( mode + '', 10 );
    this.localStorageService.setItem( 'mode', this.mode + '' );
  }

  /* istanbul ignore next */
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

  /* istanbul ignore next */
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

  /* istanbul ignore next */
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

  get showGoMode(): number {
    return this._showGoMode;
  }
  set showGoMode(goMode: number) {
    this._showGoMode = goMode;
    this.localStorageService.setItem( 'showGoMode', this.showGoMode + '' );
  }

  /* istanbul ignore next */
  get showGoModeKeys(): any {
    return [ {
      label: 'No', value: 0
    }, {
      label: 'Yes', value: 1
    } ];
  }

  get goal(): Goal {
    return this._goal;
  }
  set goal(goal: Goal) {
    this._goal = parseInt( goal + '', 10 );
    this.localStorageService.setItem( 'goal', this.goal + '' );
  }

  /* istanbul ignore next */
  get goalKeys(): any {
    const results: Array<any> = [];
    for ( const member in Goal ) {
      if ( typeof Goal[member]  === 'number' ) {
        results.push({ label: this.wordSpacingPipe.transform(member), value: Goal[member]});
      }
    }

    return results;
  }

  isExpertOrInsane(): boolean {
    return this._difficulty === Difficulty.Expert || this._difficulty === Difficulty.Insane;
  }
}
