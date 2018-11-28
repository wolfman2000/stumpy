import { Injectable } from '@angular/core';

import { WordSpacingPipe } from '../word-spacing.pipe';

import { Difficulty } from './difficulty';
import { Goal } from './goal';
import { ItemShuffle } from './item-shuffle';
import { StartState } from './start-state';
import { SwordLogic } from './sword-logic';
import { GlitchLogic } from './glitch-logic';
import { Enemy } from './enemy';
import { SaveKey, SaveService } from '../save.service';

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
    private saveService: SaveService,
    private wordSpacingPipe: WordSpacingPipe
  ) {
    if ( !this.saveService.has( SaveKey.StartState ) ) {
      this.startState = StartState.Standard;
    } else {
      this._startState = parseInt( saveService.restore( SaveKey.StartState), 10 );
    }

    if ( !this.saveService.has( SaveKey.SwordLogic ) ) {
      this.swordLogic = SwordLogic.Randomized;
    } else {
      this._swordLogic = parseInt( saveService.restore( SaveKey.SwordLogic ), 10 );
    }

    if ( !this.saveService.has( SaveKey.Difficulty ) ) {
      this.difficulty = Difficulty.Normal;
    } else {
      this._difficulty = parseInt( saveService.restore( SaveKey.Difficulty ), 10 );
    }

    if ( !this.saveService.has( SaveKey.Logic ) ) {
      this.logic = GlitchLogic.None;
    } else {
      this._logic = parseInt( saveService.restore( SaveKey.Logic ), 10 );
    }

    if ( !this.saveService.has( SaveKey.ShowGoMode ) ) {
      this.showGoMode = 0;
    } else {
      this._showGoMode = parseInt( saveService.restore( SaveKey.ShowGoMode ), 10 );
    }

    if ( !this.saveService.has( SaveKey.Goal ) ) {
      this.goal = Goal.Ganon;
    } else {
      this._goal = parseInt( saveService.restore( SaveKey.Goal ), 10 );
    }

    if ( !this.saveService.has( SaveKey.ItemShuffle ) ) {
      this.itemShuffle = ItemShuffle.Normal;
    } else {
      this._itemShuffle = parseInt( saveService.restore( SaveKey.ItemShuffle ), 10 );
    }

    if ( !this.saveService.has( SaveKey.Enemy ) ) {
      this.enemy = Enemy.Normal;
    } else {
      this._enemy = parseInt( saveService.restore( SaveKey.Enemy ) , 10 );
    }
  }

  private _startState: StartState;
  private _swordLogic: SwordLogic;
  private _logic: GlitchLogic;
  private _difficulty: Difficulty;
  private _showGoMode: number;
  private _goal: Goal;
  private _itemShuffle: ItemShuffle;
  private _enemy: Enemy;

  get startState(): StartState {
    return this._startState;
  }
  set startState(startState: StartState) {
    this._startState = parseInt( startState + '', 10 );
    this.saveService.save( SaveKey.StartState, this.startState );
  }

  get startStateKeys(): any {
    return this.getDropDownPairs(enumToArray(StartState));
  }

  get swordLogic(): SwordLogic {
    return this._swordLogic;
  }
  set swordLogic(swordLogic: SwordLogic) {
    this._swordLogic = parseInt( swordLogic + '', 10 );
    this.saveService.save( SaveKey.SwordLogic, this.swordLogic );
  }

  get swordLogicKeys(): any {
    return this.getDropDownPairs(enumToArray(SwordLogic));
  }

  get difficulty(): Difficulty {
    return this._difficulty;
  }
  set difficulty(difficulty: Difficulty) {
    this._difficulty = parseInt( difficulty + '', 10 );
    this.saveService.save( SaveKey.Difficulty, this.difficulty );
  }

  get difficultyKeys(): any {
    return this.getDropDownPairs( enumToArray(Difficulty));
  }

  get logic(): GlitchLogic {
    return this._logic;
  }
  set logic(logic: GlitchLogic) {
    this._logic = parseInt( logic + '', 10 );
    this.saveService.save( SaveKey.Logic, this.logic );
  }

  get logicKeys(): any {
    return this.getDropDownPairs( enumToArray(GlitchLogic));
  }

  get showGoMode(): number {
    return this._showGoMode;
  }
  set showGoMode(goMode: number) {
    this._showGoMode = goMode;
    this.saveService.save( SaveKey.ShowGoMode, this.showGoMode );
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
    this.saveService.save( SaveKey.Goal, this.goal );
  }

  get goalKeys(): any {
    return this.getDropDownPairs( enumToArray(Goal));
  }

  get itemShuffle(): ItemShuffle {
    return this._itemShuffle;
  }
  set itemShuffle(itemShuffle: ItemShuffle) {
    this._itemShuffle = parseInt( itemShuffle + '', 10 );
    this.saveService.save( SaveKey.ItemShuffle, this.itemShuffle );
  }

  get itemShuffleKeys(): any {
    return this.getDropDownPairs( enumToArray(ItemShuffle));
  }

  get enemy(): Enemy {
    return this._enemy;
  }
  set enemy(enemy: Enemy) {
    this._enemy = parseInt( enemy + '', 10 );
    this.saveService.save( SaveKey.Enemy, this.enemy );
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
    return this.swordLogic === SwordLogic.Swordless;
  }

  isStandard(): boolean {
    return this.startState === StartState.Standard;
  }

  isKeysanity(): boolean {
    return this.itemShuffle === ItemShuffle.Keysanity;
  }

  isRetro(): boolean {
    return this.itemShuffle === ItemShuffle.Retro;
  }

  isGoalAllDungeons(): boolean {
    return this.goal === Goal.AllDungeons;
  }

  isGoalPedestal(): boolean {
    return this.goal === Goal.MasterSwordPedestal;
  }

  isBossShuffleOn(): boolean {
    return this.enemy === Enemy.Boss;
  }
}
