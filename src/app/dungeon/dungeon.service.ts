import { Injectable } from '@angular/core';

import { EntranceLock } from './entrance-lock';
import { Location } from './location';
import { Dungeon } from './dungeon';

@Injectable()
export class DungeonService {
  constructor() {
    this._dungeons = new Map<Location, Dungeon>();
    this.dungeons.set(Location.AgahnimTower, new Dungeon(0));
    this.dungeons.set(Location.EasternPalace, new Dungeon(3));
    this.dungeons.set(Location.DesertPalace, new Dungeon(2));
    this.dungeons.set(Location.TowerOfHera, new Dungeon(2));
    this.dungeons.set(Location.PalaceOfDarkness, new Dungeon(5));
    this.dungeons.set(Location.SwampPalace, new Dungeon(6));
    this.dungeons.set(Location.SkullWoods, new Dungeon(2));
    this.dungeons.set(Location.ThievesTown, new Dungeon(4));
    this.dungeons.set(Location.IcePalace, new Dungeon(3));
    this.dungeons.set(Location.MiseryMire, new Dungeon(2, EntranceLock.Unknown));
    this.dungeons.set(Location.TurtleRock, new Dungeon(5, EntranceLock.Unknown));
  }

  private _dungeons: Map<Location, Dungeon>;
  get dungeons(): Map<Location, Dungeon> {
    return this._dungeons;
  }

  get agahnimTower(): Dungeon {
    return this.dungeons[Location.AgahnimTower];
  }

  get easternPalace(): Dungeon {
    return this.dungeons[Location.EasternPalace];
  }

  get desertPalace(): Dungeon {
    return this.dungeons[Location.DesertPalace];
  }

  get towerOfHera(): Dungeon {
    return this.dungeons[Location.TowerOfHera];
  }

  get palaceOfDarkness(): Dungeon {
    return this.dungeons[Location.PalaceOfDarkness];
  }

  get swampPalace(): Dungeon {
    return this.dungeons[Location.SwampPalace];
  }

  get skullWoods(): Dungeon {
    return this.dungeons[Location.SkullWoods];
  }

  get thievesTown(): Dungeon {
    return this.dungeons[Location.ThievesTown];
  }

  get icePalace(): Dungeon {
    return this.dungeons[Location.IcePalace];
  }

  get miseryMire(): Dungeon {
    return this.dungeons[Location.MiseryMire];
  }

  get turtleRock(): Dungeon {
    return this.dungeons[Location.TurtleRock];
  }
}
