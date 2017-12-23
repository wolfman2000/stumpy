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

  get agahnimTower(): Dungeon {
    return this.dungeons.get(Location.CastleTower);
  }

  get easternPalace(): Dungeon {
    return this.dungeons.get(Location.EasternPalace);
  }

  get desertPalace(): Dungeon {
    return this.dungeons.get(Location.DesertPalace);
  }

  get towerOfHera(): Dungeon {
    return this.dungeons.get(Location.TowerOfHera);
  }

  get palaceOfDarkness(): Dungeon {
    return this.dungeons.get(Location.PalaceOfDarkness);
  }

  get swampPalace(): Dungeon {
    return this.dungeons.get(Location.SwampPalace);
  }

  get skullWoods(): Dungeon {
    return this.dungeons.get(Location.SkullWoods);
  }

  get thievesTown(): Dungeon {
    return this.dungeons.get(Location.ThievesTown);
  }

  get icePalace(): Dungeon {
    return this.dungeons.get(Location.IcePalace);
  }

  get miseryMire(): Dungeon {
    return this.dungeons.get(Location.MiseryMire);
  }

  get turtleRock(): Dungeon {
    return this.dungeons.get(Location.TurtleRock);
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

  crystalDungeons(): Array<Dungeon> {
    return Array.from( this.dungeons.values() )
      .filter( d => d.reward === Reward.StandardCrystal || d.reward === Reward.FairyCrystal );
  }

  pendantDungeons(): Array<Dungeon> {
    return Array.from( this.dungeons.values() )
      .filter( d => d.reward === Reward.StandardPendant || d.reward === Reward.GreenPendant );
  }

  private areAllRewardDungeonsBeaten(): boolean {
    return Array.from( this.dungeons.values() )
      .filter( d => d.reward !== Reward.None ).every( d => d.isBossDefeated );
  }
}
