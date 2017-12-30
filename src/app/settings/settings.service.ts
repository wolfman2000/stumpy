import { Injectable } from '@angular/core';

import { LocalStorageService } from '../local-storage.service';
import { WordSpacingPipe } from '../word-spacing.pipe';

import { Difficulty } from './difficulty';
import { Goal } from './goal';
import { ItemShuffle } from './item-shuffle';
import { Mode } from './mode';
import { GlitchLogic } from './glitch-logic';
import { Enemy } from './enemy';

interface EnumItem<E> {
  value: E;
  key: keyof E;
}

function enumToArray<E>(Enum: any): EnumItem<E>[] {
  return Object.keys(Enum).map(key => ({value: Enum[key], key: key} as EnumItem<E>));
}

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

    if ( !this.localStorageService.hasItem( 'itemShuffle' ) ) {
      this.itemShuffle = ItemShuffle.Normal;
    } else {
      this._itemShuffle = parseInt( localStorage.getItem( 'itemShuffle' ), 10 );
    }

    if( !this.localStorageService.hasItem( 'enemy' ) ) {
      this.enemy = Enemy.Normal;
    } else {
      this._enemy = parseInt( localStorage.getItem( 'enemy' ) , 10 );
    }
  }

  private _mode: Mode;
  private _logic: GlitchLogic;
  private _difficulty: Difficulty;
  private _showGoMode: number;
  private _goal: Goal;
  private _itemShuffle: ItemShuffle;
  private _enemy: Enemy;

  get mode(): Mode {
    return this._mode;
  }
  set mode(mode: Mode) {
    this._mode = parseInt( mode + '', 10 );
    this.localStorageService.setItem( 'mode', this.mode + '' );
  }

  get modeKeys(): any {
    return this.getDropDownPairs( enumToArray(Mode));
  }

  get difficulty(): Difficulty {
    return this._difficulty;
  }
  set difficulty(difficulty: Difficulty) {
    this._difficulty = parseInt( difficulty + '', 10 );
    this.localStorageService.setItem( 'difficulty', this.difficulty + '' );
  }

  get difficultyKeys(): any {
    return this.getDropDownPairs( enumToArray(Difficulty));
  }

  get logic(): GlitchLogic {
    return this._logic;
  }
  set logic(logic: GlitchLogic) {
    this._logic = parseInt( logic + '', 10 );
    this.localStorageService.setItem( 'logic', this.logic + '' );
  }

  get logicKeys(): any {
    return this.getDropDownPairs( enumToArray(GlitchLogic));
  }

  get showGoMode(): number {
    return this._showGoMode;
  }
  set showGoMode(goMode: number) {
    this._showGoMode = goMode;
    this.localStorageService.setItem( 'showGoMode', this.showGoMode + '' );
  }

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

  get goalKeys(): any {
    return this.getDropDownPairs( enumToArray(Goal));
  }

  get itemShuffle(): ItemShuffle {
    return this._itemShuffle;
  }
  set itemShuffle(itemShuffle: ItemShuffle) {
    this._itemShuffle = parseInt( itemShuffle + '', 10 );
    this.localStorageService.setItem( 'itemShuffle', this.itemShuffle + '' );
  }

  get itemShuffleKeys(): any {
    return this.getDropDownPairs( enumToArray(ItemShuffle));
  }

  get enemy(): Enemy {
    return this._enemy;
  }
  set enemy(enemy: Enemy) {
    this._enemy = parseInt( enemy + '', 10 );
    this.localStorageService.setItem( 'enemy', this.enemy + '' );
  }

  get enemyKeys(): any {
    return this.getDropDownPairs( enumToArray( Enemy ) );
  }

  private getDropDownPairs( items: Array<any> ): any {
    return items
      .filter( e => typeof e.value === 'number' )
      .map( e => { return {
        label: this.wordSpacingPipe.transform( e.key ),
        value: e.value
      }; } );
  }

  isNormalDifficulty(): boolean {
    return this.difficulty === Difficulty.Normal;
  }

  isHardDifficulty(): boolean {
    return this.difficulty === Difficulty.Hard;
  }

  isHardDifficultyOrHigher(): boolean {
    return this.difficulty !== Difficulty.Easy && this.difficulty !== Difficulty.Normal;
  }

  isExpertOrInsane(): boolean {
    return this._difficulty === Difficulty.Expert || this._difficulty === Difficulty.Insane;
  }

  isMajorGlitches(): boolean {
    return this.logic === GlitchLogic.Major;
  }

  isSwordless(): boolean {
    return this.mode === Mode.Swordless;
  }

  isStandard(): boolean {
    return this.mode === Mode.Standard;
  }

  isKeysanity(): boolean {
    return this.itemShuffle === ItemShuffle.Keysanity;
  }

  isGoalAllDungeons(): boolean {
    return this.goal === Goal.AllDungeons;
  }

  isBossShuffleOn(): boolean {
    return this.enemy === Enemy.Boss;
  }
}
