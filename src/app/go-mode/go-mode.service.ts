import { Injectable } from '@angular/core';

import { ItemService } from '../items/item.service';
import { DungeonService } from '../dungeon/dungeon.service';
import { SettingsService } from '../settings/settings.service';
import { DungeonLocationService } from '../map/dungeon-locations/dungeon-location.service';

import { Dungeon } from '../dungeon/dungeon';

import { Availability } from '../map/availability';

@Injectable()
export class GoModeService {
  constructor(
    private _items: ItemService,
    private _dungeons: DungeonService,
    private _dungeonLocations: DungeonLocationService,
    private _settings: SettingsService
  ) {}

  isGoMode(): Availability {
    const items = this._items;
    // Bow is always required (assuming no enemizer): red mimics/goriyas.
    if ( !items.bow ) {
      return Availability.Unavailable;
    }

    // Hammer is needed for practically all dark world navigation.
    if ( !items.hammer ) {
      return Availability.Unavailable;
    }

    // One light source is always required for the torches.
    // Ideally, fire rod would always be required, but not guaranteed yet.
    if ( !items.lantern && !items.fireRod ) {
      return Availability.Unavailable;
    }

    // When not in swordless mode, we need a sword.
    if ( !this._settings.isSwordless() && items.sword < 2 ) {
      return Availability.Unavailable;
    }

    const dungeons = this.getCorrectDungeons();
    if ( !this.isDungeonCountCorrect( dungeons ) ) {
      return Availability.Unavailable;
    }

    const crystalAvailabilities = dungeons.map( c => {
      return this._dungeonLocations.getBossAvailability(c.location);
    } );

    if ( crystalAvailabilities.every( e => e === Availability.Available ) ) {
      return items.silvers ? Availability.Available : Availability.Glitches;
    }

    if ( crystalAvailabilities.some(e => e === Availability.Unavailable ) ) {
      return Availability.Unavailable;
    }

    if ( crystalAvailabilities.some( e => e === Availability.Possible ) ) {
      return Availability.Possible;
    }

    if ( crystalAvailabilities.some( e => e === Availability.Glitches ) ) {
      return Availability.Glitches;
    }

    return Availability.Unavailable;
  }

  private getCorrectDungeons(): Dungeon[] {
    if ( this._settings.isGoalAllDungeons() ) {
      return this._dungeons.allDungeons();
    }

    return this._dungeons.crystalDungeons();
  }

  private isDungeonCountCorrect( dungeons: Dungeon[] ): boolean {
    if ( this._settings.isGoalAllDungeons() ) {
      return true;
    }

    return dungeons.length >= 7;
  }
}
