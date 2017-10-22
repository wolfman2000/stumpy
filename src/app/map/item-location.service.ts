import { Injectable } from '@angular/core';

import { Availability } from './availability';
import { LocationKey } from './location-key';
import { ItemLocation } from './item-location';

import { Glove } from '../items/glove/glove';
import { Sword } from '../items/sword/sword';

import { InventoryService } from '../inventory.service';
import { DungeonService } from '../dungeon/dungeon.service';
import { SettingsService } from '../settings/settings.service';

import { EntranceLock } from '../dungeon/entrance-lock';
import { Location } from '../dungeon/location';
import { Mode } from '../settings/mode';

@Injectable()
export class ItemLocationService {
  constructor(
    private _inventory: InventoryService,
    private _dungeons: DungeonService,
    private _settings: SettingsService
  ) {
    this._itemLocations = new Map<LocationKey, ItemLocation>();
    this.itemLocations.set( LocationKey.KingsTomb, new ItemLocation(
      'King\'s Tomb',
      'boots and titans or mirror',
      59.5,
      27,
      this.isKingsTombAvailable,
      this
    ));
    this.itemLocations.set( LocationKey.LightWorldSwamp, new ItemLocation(
      'Light World Swamp',
      '',
      45,
      91,
      ItemLocationService.always,
      this
    ));
    this.itemLocations.set( LocationKey.LinksHouse, new ItemLocation(
      'Link\'s House',
      '',
      52.5,
      65.3,
      ItemLocationService.always,
      this,
      _settings.mode === Mode.Standard
    ));
    this.itemLocations.set( LocationKey.SpiralCave, new ItemLocation(
      'Spiral Cave',
      'East Death Mountain Access',
      77.9,
      6.6,
      this.isSpiralCaveAccessible,
      this
    ));
    this.itemLocations.set( LocationKey.MimicCave, new ItemLocation(
      'Mimic Cave',
      'mirror',
      83,
      6.6,
      this.isMimicCaveAvailable,
      this
    ));
  }

  private _itemLocations: Map<LocationKey, ItemLocation>;

  private static always(): Availability {
    return Availability.Available;
  }

  private medallionState( location: Location ): Availability {
    const dungeon = this._dungeons.getDungeon( location );
    if ( dungeon.entranceLock === EntranceLock.None) {
      return Availability.Available;
    }

    const inventory = this._inventory;

    if ( !inventory.bombos && !inventory.ether && !inventory.quake ) {
      return Availability.Unavailable;
    }

    if ( this._settings.mode !== Mode.Swordless && inventory.sword === Sword.None ) {
      return Availability.Unavailable;
    }

    if ( this._settings.mode === Mode.Swordless && !inventory.hammer ) {
      return Availability.Unavailable;
    }

    if ( dungeon.entranceLock === EntranceLock.Bombos && !inventory.bombos ) {
      return Availability.Unavailable;
    }

    if ( dungeon.entranceLock === EntranceLock.Ether && !inventory.ether ) {
      return Availability.Unavailable;
    }

    if ( dungeon.entranceLock === EntranceLock.Quake && !inventory.quake ) {
      return Availability.Unavailable;
    }

    if ( dungeon.entranceLock === EntranceLock.Unknown && !(inventory.bombos && inventory.ether && inventory.quake)) {
      return Availability.Possible;
    }

    return Availability.Available;
  }

  private hasMelee(): boolean {
    return this._inventory.sword !== Sword.None || this._inventory.hammer;
  }

  private hasMeleeOrBow(): boolean {
    return this.hasMelee() || this._inventory.bow;
  }

  private hasCane(): boolean {
    return this._inventory.somaria || this._inventory.byrna;
  }

  private hasRod(): boolean {
    return this._inventory.fireRod || this._inventory.iceRod;
  }

  private canReachOutcast(): boolean {
    const inventory = this._inventory;
    if ( !inventory.moonPearl ) {
      return false;
    }

    const agahnimTower = this._dungeons.agahnimTower;

    return (
      inventory.glove === Glove.Titan ||
      inventory.glove !== Glove.None && inventory.hammer ||
      agahnimTower.isBossDefeated && inventory.hookshot && (
        inventory.hammer || inventory.glove !== Glove.None || inventory.flippers
      )
    );
  }

  private isKingsTombAvailable(): Availability {
    if ( this.canReachOutcast() && this._inventory.mirror ) {
      return this._inventory.boots ? Availability.Available : Availability.Glitches;
    }

    return this._inventory.glove === Glove.Titan ? Availability.Available : Availability.Unavailable;
  }

  private isSpiralCaveAccessible(): Availability {
    const inventory = this._inventory;
    if ( !(inventory.glove || inventory.flute)) {
      return Availability.Unavailable;
    }

    if ( !(inventory.hookshot || inventory.mirror && inventory.hammer)) {
      return Availability.Unavailable;
    }

    return inventory.lantern || inventory.flute ?
      Availability.Available :
      Availability.Glitches;
  }

  private isMimicCaveAvailable(): Availability {
    const inventory = this._inventory;
    if ( !inventory.moonPearl || !inventory.hammer || !inventory.somaria || !inventory.mirror || inventory.glove !== Glove.Titan) {
      return Availability.Unavailable;
    }

    const medallionState = this.medallionState( Location.TurtleRock);
    if ( medallionState !== Availability.Available ) {
      return medallionState;
    }

    if ( !inventory.fireRod) {
      return Availability.Possible;
    }

    return inventory.lantern || inventory.flute ? Availability.Available : Availability.Glitches;
  }

  get itemLocations(): Map<LocationKey, ItemLocation> {
    return this._itemLocations;
  }

  getItemLocation(id: number): ItemLocation {
    return this.itemLocations.get(id);
  }
}
