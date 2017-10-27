import { Injectable } from '@angular/core';

import { EntranceLock } from './entrance-lock';
import { Location } from './location';
import { Dungeon } from './dungeon';
import { Reward } from './reward';

@Injectable()
export class DungeonService {
  constructor() {
    this._dungeons = new Map<Location, Dungeon>();
    this.dungeons.set( Location.AgahnimTower, new Dungeon('Agahnim\'s Tower', 'Agahnim', Reward.None, 0));
    this.dungeons.set(Location.EasternPalace, new Dungeon('Eastern Palace', 'Armos Knights', Reward.Unknown, 3));
    this.dungeons.set(Location.DesertPalace, new Dungeon('Desert Palace', 'Lanmolas', Reward.Unknown, 2));
    this.dungeons.set(Location.TowerOfHera, new Dungeon('Tower of Hera', 'Moldorm', Reward.Unknown, 2));
    this.dungeons.set(Location.PalaceOfDarkness, new Dungeon('Palace of Darkness', 'Helmasaur King', Reward.Unknown, 5));
    this.dungeons.set(Location.SwampPalace, new Dungeon('Swamp Palace', 'Arrghus', Reward.Unknown, 6));
    this.dungeons.set(Location.SkullWoods, new Dungeon('Skull Woods', 'Mothula', Reward.Unknown, 2));
    this.dungeons.set(Location.ThievesTown, new Dungeon('Thieves Town', 'Blind', Reward.Unknown, 4));
    this.dungeons.set(Location.IcePalace, new Dungeon('Ice Palace', 'Kholdstare', Reward.Unknown, 3));
    this.dungeons.set(Location.MiseryMire, new Dungeon('Misery Mire', 'Vitreous', Reward.Unknown, 2, EntranceLock.Unknown));
    this.dungeons.set(Location.TurtleRock, new Dungeon('Turtle Rock', 'Trinexx', Reward.Unknown, 5, EntranceLock.Unknown));
  }

  private _dungeons: Map<Location, Dungeon>;
  get dungeons(): Map<Location, Dungeon> {
    return this._dungeons;
  }

  get agahnimTower(): Dungeon {
    return this.dungeons.get(Location.AgahnimTower);
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

  private areAllRewardDungeonsBeaten(): boolean {
    return Array.from( this.dungeons.values() )
      .filter( d => d.reward !== Reward.None ).every( d => d.isBossDefeated );
  }
}
