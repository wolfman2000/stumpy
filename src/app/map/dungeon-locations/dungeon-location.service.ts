import { Injectable } from '@angular/core';

import { InventoryService } from '../../inventory.service';
import { DungeonService } from '../../dungeon/dungeon.service';
import { SettingsService } from '../../settings/settings.service';

import { Availability } from '../availability';
import { Location } from '../../dungeon/location';

import { DungeonLocation } from './dungeon-location';
import { DungeonLocations } from './dungeon-location.repository';

import { Mode } from '../../settings/mode';
import { Sword } from '../../items/sword/sword';
import { Glove } from '../../items/glove/glove';

@Injectable()
export class DungeonLocationService {
  constructor(
    private _inventory: InventoryService,
    private _dungeons: DungeonService,
    private _settings: SettingsService
  ) {
    this._dungeonLocations = DungeonLocations;
    this._bossAvailability = new Map<Location, () => Availability>(
      [
        [Location.AgahnimTower, this.isAgahnimAvailable],
        [Location.EasternPalace, this.isArmosKnightsAvailable],
        [Location.DesertPalace, this.isLanmolasAvailable],
        [Location.TowerOfHera, this.isMoldormAvailable]
      ]
    );

    this._chestAvailability = new Map<Location, () => Availability>(
      [
        [Location.AgahnimTower, this.isAgahnimAvailable],
        [Location.EasternPalace, this.isArmosKnightsRaidable],
        [Location.DesertPalace, this.isLanmolasRaidable],
        [Location.TowerOfHera, this.isMoldormRaidable]
      ]
    );
  }

  private _bossAvailability: Map<Location, () => Availability>;
  private _chestAvailability: Map<Location, () => Availability>;
  private _dungeonLocations: Map<Location, DungeonLocation>;

  private isAgahnimSwordlessAvailable(): Availability {
    if ( !(this._inventory.hammer || this._inventory.cape) ) {
      return Availability.Unavailable;
    }

    if ( !this._inventory.net ) {
      return Availability.Unavailable;
    }

    return this._inventory.lantern ? Availability.Available : Availability.Glitches;
  }

  private isAgahnimAvailable(): Availability {
    if ( this._settings.mode === Mode.Swordless ) {
      return this.isAgahnimSwordlessAvailable();
    }

    const items = this._inventory;

    const canEnter = items.cape || ( items.sword !== Sword.None && items.sword !== Sword.Wooden );
    const canBeatAgahnim = items.net || items.sword !== Sword.None;

    if ( !canEnter && !canBeatAgahnim ) {
      return Availability.Unavailable;
    }

    return items.lantern ? Availability.Available : Availability.Glitches;
  }

  private isArmosKnightsAvailable(): Availability {
    if ( !this._inventory.bow ) {
      return Availability.Unavailable;
    }

    return this._inventory.lantern ? Availability.Available : Availability.Glitches;
  }

  private isArmosKnightsRaidable(): Availability {
    const dungeon = this._dungeons.easternPalace;
    if ( dungeon.chestCount <= 2 && !this._inventory.lantern ) {
      return Availability.Possible;
    }

    if ( dungeon.chestCount === 1 && !this._inventory.bow ) {
      return Availability.Possible;
    }

    return Availability.Available;
  }

  private isLanmolasAvailable(): Availability {
    const items = this._inventory;

    if ( !(items.hasMeleeOrBow() || items.hasCane() || items.hasRod()) ) {
      return Availability.Unavailable;
    }

    const canEnterLightWay = items.book && items.hasGlove();
    const canEnterDarkWay = items.hasDarkMireMirrorAccess();
    if ( !canEnterLightWay && !canEnterDarkWay ) {
      return Availability.Unavailable;
    }

    if (!items.hasFireSource()) {
      return Availability.Unavailable;
    }

    return items.boots ? Availability.Available : Availability.Possible;
  }

  private isLanmolasRaidable(): Availability {
    const items = this._inventory;
    if ( !items.book && !items.hasDarkMireMirrorAccess()) {
      return Availability.Unavailable;
    }

    if ( items.hasGlove() && items.hasFireSource() && items.boots ) {
      return Availability.Available;
    }

    const dungeon = this._dungeons.desertPalace;
    return dungeon.chestCount > 1 && items.boots ? Availability.Available : Availability.Possible;
  }

  private isMoldormAvailable(): Availability {
    if ( !this._inventory.hasMelee()) {
      return Availability.Unavailable;
    }

    return this.isMoldormRaidable();
  }

  private isMoldormRaidable(): Availability {
    const items = this._inventory;
    if ( !items.hasDeathMountainAccess() ) {
      return Availability.Unavailable;
    }

    if ( !items.mirror && !(items.hookshot && items.hammer) ) {
      return Availability.Unavailable;
    }

    if ( !items.hasFireSource() ) {
      return Availability.Possible;
    }

    return items.hasMountainSavePoint() ? Availability.Available : Availability.Glitches;
  }

  getBossAvailability(id: Location): Availability {
    return this._bossAvailability.get(id).call(this);
  }

  getChestAvailability(id: Location): Availability {
    return this._chestAvailability.get(id).call(this);
  }

  getDungeonLocation(id: Location): DungeonLocation {
    return this._dungeonLocations.get(id);
  }

  getBossName(id: Location): string {
    return this._dungeons.getDungeon(id).bossName;
  }

  getChestCount(id: Location): number {
    return this._dungeons.getDungeon(id).chestCount;
  }

  isBossDefeated(id: Location): boolean {
    return this._dungeons.getDungeon(id).isBossDefeated;
  }
}
