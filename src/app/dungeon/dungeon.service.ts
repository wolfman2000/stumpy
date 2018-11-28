import { Injectable } from '@angular/core';

import { Location } from './location';
import { Dungeon } from './dungeon';
import { Reward } from './reward';

import { Dungeons } from './dungeon.repository';
import { SaveKey, SaveService } from '../save.service';

@Injectable()
export class DungeonService {
  constructor(
    private _saveService: SaveService
  ) {
    this._dungeons = Dungeons;

    this.deserialize(this._saveService.restore<number[][]>(SaveKey.Dungeons, []));
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

  saveState() {
    this._saveService.save<number[][]>(SaveKey.Dungeons, this.serialize());
  }

  private areAllRewardDungeonsBeaten(): boolean {
    return Array.from( this.dungeons.values() )
      .filter( d => d.reward !== Reward.None ).every( d => d.isBossDefeated );
  }

  private serialize(): number[][] {
    return Object.values(Location).map((key: Location) => {
      if (!Number.isInteger(key)) {
        return null;
      }

      const dungeon: Dungeon = this._dungeons.get(key);

      return !dungeon ? [] : [
        dungeon.itemChestCount,
        dungeon.totalChestCount,
        dungeon.bossId,
        dungeon.isBossDefeated ? 1 : 0,
        dungeon.hasBigKey ? 1 : 0,
        dungeon.smallKeyCount,
        dungeon.retroChestCount,
        dungeon.reward,
        dungeon.entranceLock,
      ];
    }).filter(item => item !== null);
  }

  private deserialize(serialized: number[][]): void {
    serialized.forEach((states: number[], key: number) => {
      if (states.length === 0) {
        return;
      }

      const dungeon: Dungeon = this._dungeons.get(key);

      // TODO create setters?
      dungeon['_itemChestCount'] = states[0];
      dungeon['_totalChestCount'] = states[1];
      dungeon['_bossId'] = states[2];
      dungeon['_isBossDefeated'] = !!states[3];
      dungeon['_hasBigKey'] = !!states[4];
      dungeon['_smallKeyCount'] = states[5];
      dungeon['_retroChestCount'] = states[6];
      dungeon['_reward'] = states[7];
      dungeon['_entranceLock'] = states[8];

      this._dungeons.set(key, dungeon);
    });
  }
}
