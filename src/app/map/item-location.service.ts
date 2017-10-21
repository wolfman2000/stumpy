import { Injectable } from '@angular/core';

import { Availability } from './availability';
import { LocationKey } from './location-key';
import { ItemLocation } from './item-location';

import { Glove } from '../items/glove/glove';
import { Sword } from '../items/sword/sword';

import { InventoryService } from '../inventory.service';
import { DungeonService } from '../dungeon/dungeon.service';

@Injectable()
export class ItemLocationService {
  constructor(
    private _inventory: InventoryService,
    private _dungeons: DungeonService
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
  }

  private _itemLocations: Map<LocationKey, ItemLocation>;

  get kingsTomb(): ItemLocation {
    return this.itemLocations.get(LocationKey.KingsTomb);
  }

  private static always(): Availability {
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

  get itemLocations(): Map<LocationKey, ItemLocation> {
    return this._itemLocations;
  }

  getItemLocation(id: number): ItemLocation {
    return this.itemLocations.get(id);
  }
}
