import { Injectable } from '@angular/core';

import { EntranceLock } from './entrance-lock';
import { Location } from './location';
import { Dungeon } from './dungeon';
import { Reward } from './reward';

import { Dungeons } from './dungeon.repository';

@Injectable()
export class DungeonService {
  constructor() {
    this._dungeons = Dungeons;
  }

  private _dungeons: Map<Location, Dungeon>;
  get dungeons(): Map<Location, Dungeon> {
    return this._dungeons;
  }

  hasGreenPendant(): boolean {
    const dungeons = Array.from( this.dungeons.values() );
    if ( dungeons.some( d => d.reward === Reward.GreenPendant && d.isBossDefeated ) ) {
      return true;
    }

    return this.areAllRewardDungeonsBeaten();
  }

  hasAllPendants(): boolean {
    const dungeons = Array.from( this.dungeons.values() );

    const pendantDungeons = dungeons
      .filter( d => d.reward === Reward.GreenPendant || d.reward === Reward.StandardPendant );

    if ( pendantDungeons.length === 3 && pendantDungeons.every( d => d.isBossDefeated ) ) {
      return true;
    }

    return this.areAllRewardDungeonsBeaten();
  }

  hasFatFairyCrystals(): boolean {
    const dungeons = Array.from( this.dungeons.values() );

    const fairyCrystals = dungeons
      .filter( d => d.reward === Reward.FairyCrystal );

    if ( fairyCrystals.length === 2 && fairyCrystals.every( d => d.isBossDefeated ) ) {
      return true;
    }

    return this.areAllRewardDungeonsBeaten();
  }

  getDungeon(id: number): Dungeon {
    return this.dungeons.get(id);
  }

  reset(): void {
    this.dungeons.forEach( d => d.reset() );
  }

  allDungeons(): Array<Dungeon> {
    return Array.from( this.dungeons.values() );
  }

  crystalDungeons(): Array<Dungeon> {
    return Array.from( this.dungeons.values() )
      .filter( d => d.reward === Reward.StandardCrystal || d.reward === Reward.FairyCrystal );
  }

  pendantDungeons(): Array<Dungeon> {
    return Array.from( this.dungeons.values() )
      .filter( d => d.reward === Reward.StandardPendant || d.reward === Reward.GreenPendant );
  }

  hasBigKey(id: number): boolean {
    return id !== Location.CastleTower;
  }

  private areAllRewardDungeonsBeaten(): boolean {
    return Array.from( this.dungeons.values() )
      .filter( d => d.reward !== Reward.None ).every( d => d.isBossDefeated );
  }
}
