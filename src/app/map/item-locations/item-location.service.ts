import { Injectable } from '@angular/core';

import { Availability } from '../availability';
import { LocationKey } from './location-key';
import { ItemLocation } from './item-location';

import { Glove } from '../../items/glove/glove';
import { Sword } from '../../items/sword/sword';

import { InventoryService } from '../../inventory.service';
import { DungeonService } from '../../dungeon/dungeon.service';
import { SettingsService } from '../../settings/settings.service';

import { ItemLocations } from './item-location.repository';

import { EntranceLock } from '../../dungeon/entrance-lock';
import { Location } from '../../dungeon/location';
import { Mode } from '../../settings/mode';

@Injectable()
export class ItemLocationService {
  constructor(
    private _inventory: InventoryService,
    private _dungeons: DungeonService,
    private _settings: SettingsService
  ) {
    this._itemLocations = ItemLocations;
    this._availabilityMap = new Map<LocationKey, () => Availability>(
      [
        [LocationKey.KingsTomb, this.isKingsTombAvailable],
        [LocationKey.LightWorldSwamp, ItemLocationService.always],
        [LocationKey.LinksHouse, ItemLocationService.always],
        [LocationKey.SpiralCave, this.isEastDeathMountainAvailable],
        [LocationKey.MimicCave, this.isMimicCaveAvailable],
        [LocationKey.Tavern, ItemLocationService.always],
        [LocationKey.ChickenHouse, ItemLocationService.always],
        [LocationKey.AginahsCave, ItemLocationService.always],
        [LocationKey.SahasrahlasHut, ItemLocationService.always],
        [LocationKey.KakarikoWell, ItemLocationService.always],
        [LocationKey.BlindsHut, ItemLocationService.always],
        [LocationKey.ParadoxCave, this.isEastDeathMountainAvailable],
        [LocationKey.BonkRocks, this.isBonkRocksAvailable],
        [LocationKey.MiniMoldormCave, ItemLocationService.always],
        [LocationKey.IceRodCave, ItemLocationService.always],
        [LocationKey.BottleVendor, ItemLocationService.always],
        [LocationKey.SahasrahlasReward, this.hasGreenPendant],
        [LocationKey.SickKid, this.hasBottles],
        [LocationKey.BridgeHideout, this.hasBridgeAccess],
        [LocationKey.EtherTablet, this.isEtherTabletAvailable],
        [LocationKey.BombosTablet, this.isBombosTabletAvailable],
        [LocationKey.KingZora, this.hasKingZoraAccess],
        [LocationKey.LostOldMan, this.hasOldManAccess],
        [LocationKey.PotionShop, this.hasPotionShopAccess],
        [LocationKey.ForestHideout, ItemLocationService.always],
        [LocationKey.LumberjackTree, this.hasLumberjackAccess],
        [LocationKey.SpectacleRockCave, this.hasSpectacleRockCaveAccess],
        [LocationKey.MirrorCave, this.hasMirrorCaveAccess],
        [LocationKey.GraveyardCliffCave, this.hasGraveyardCliffAccess],
        [LocationKey.CheckerboardCave, this.hasCheckerboardCaveAccess],
        [LocationKey.Library, this.hasLibraryAccess],
        [LocationKey.Mushroom, ItemLocationService.always],
        [LocationKey.SpectacleRock, this.hasSpectacleRockAccess],
        [LocationKey.FloatingIsland, this.hasFloatingIslandAccess],
        [LocationKey.RaceMinigame, ItemLocationService.always],
        [LocationKey.DesertWestLedge, this.hasDesertWestLedgeAccess],
        [LocationKey.LakeHyliaIsland, this.hasLakeHyliaIslandAccess],
        [LocationKey.ZoraLedge, this.hasZoraLedgeAccess],
        [LocationKey.BuriedItem, this.hasBuriedItemAccess],
        [LocationKey.SewerEscapeSideRoom, this.hasSewerEscapeSideRoomAccess],
        [LocationKey.CastleSecretEntrance, ItemLocationService.always],
        [LocationKey.CastleDungeon, ItemLocationService.always],
        [LocationKey.Sanctuary, ItemLocationService.always],
        [LocationKey.MadBatter, this.hasMadBatterAccess],
        [LocationKey.DwarfEscort, this.hasDwarfAccess],
        [LocationKey.MasterSwordPedestal, this.hasPedestalAccess],
        [LocationKey.SewerEscapeDarkRoom, this.hasSewerDarkRoomAccess],
        [LocationKey.WaterfallOfWishing, this.hasBridgeAccess]
      ]
    );
  }

  private _itemLocations: Map<LocationKey, ItemLocation>;
  private _availabilityMap: Map<LocationKey, () => Availability>;

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

  private hasMedallionWeapon(): boolean {
    return ( this._settings.mode === Mode.Swordless && this._inventory.hammer ) ||
      this._inventory.sword !== Sword.None && this._inventory.sword !== Sword.Wooden;
  }

  private isAgahnimDefeated(): boolean {
    return this._dungeons.agahnimTower.isBossDefeated;
  }

  private canReachOutcast(): boolean {
    const inventory = this._inventory;
    if ( !inventory.moonPearl ) {
      return false;
    }

    return (
      inventory.glove === Glove.Titan ||
      inventory.hasGlove() && inventory.hammer ||
      this.isAgahnimDefeated() && inventory.hookshot && (
        inventory.hammer || inventory.hasGlove() || inventory.flippers
      )
    );
  }

  private isKingsTombAvailable(): Availability {
    if ( this.canReachOutcast() && this._inventory.mirror ) {
      return this._inventory.boots ? Availability.Available : Availability.Glitches;
    }

    return this._inventory.glove === Glove.Titan ? Availability.Available : Availability.Unavailable;
  }

  private isEastDeathMountainAvailable(): Availability {
    const inventory = this._inventory;
    if ( !(inventory.hasDeathMountainAccess() ) ) {
      return Availability.Unavailable;
    }

    if ( !(inventory.hookshot || inventory.mirror && inventory.hammer)) {
      return Availability.Unavailable;
    }

    return inventory.hasMountainSavePoint() ?
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

    return inventory.hasMountainSavePoint() ? Availability.Available : Availability.Glitches;
  }

  private isBonkRocksAvailable(): Availability {
    return this._inventory.boots ? Availability.Available : Availability.Unavailable;
  }

  private hasGreenPendant(): Availability {
    const dungeons = this._dungeons;
    if ( dungeons.hasGreenPendant() ) {
      return Availability.Available;
    }

    return Availability.Unavailable;
  }

  private hasBottles(): Availability {
    return this._inventory.bottles > 0 ? Availability.Available : Availability.Unavailable;
  }

  private hasBridgeAccess(): Availability {
    return this._inventory.flippers ? Availability.Available : Availability.Glitches;
  }

  private isEtherTabletAvailable(): Availability {
    const inventory = this._inventory;
    if ( !inventory.book ) {
      return Availability.Unavailable;
    }

    if ( !inventory.hasDeathMountainAccess() ) {
      return Availability.Unavailable;
    }

    if ( !(inventory.mirror || inventory.hookshot && inventory.hammer) ) {
      return Availability.Unavailable;
    }

    if (!this.hasMedallionWeapon()) {
      return Availability.Visible;
    }

    return inventory.hasMountainSavePoint() ? Availability.Available : Availability.Glitches;
  }

  private isBombosTabletAvailable(): Availability {
    const inventory = this._inventory;

    if ( !inventory.book ) {
      return Availability.Unavailable;
    }

    const mirrorCaveAccess = this.hasMirrorCaveAccess();
    if ( mirrorCaveAccess !== Availability.Available) {
      return mirrorCaveAccess;
    }

    return this.hasMedallionWeapon() ? Availability.Available : Availability.Visible;
  }

  private hasKingZoraAccess(): Availability {
    return this._inventory.flippers || this._inventory.hasGlove() ? Availability.Available : Availability.Glitches;
  }

  private hasOldManAccess(): Availability {
    if ( !this._inventory.hasDeathMountainAccess() ) {
      return Availability.Unavailable;
    }

    return this._inventory.lantern ? Availability.Available : Availability.Glitches;
  }

  private hasPotionShopAccess(): Availability {
    return this._inventory.mushroom ? Availability.Available : Availability.Unavailable;
  }

  private hasLumberjackAccess(): Availability {
    return this.isAgahnimDefeated() && this._inventory.boots ? Availability.Available : Availability.Visible;
  }

  private hasSpectacleRockCaveAccess(): Availability {
    if ( !this._inventory.hasDeathMountainAccess() ) {
      return Availability.Unavailable;
    }

    return this._inventory.hasMountainSavePoint() ? Availability.Available : Availability.Glitches;
  }

  private hasMirrorCaveAccess(): Availability {
    const inventory = this._inventory;
    if ( !inventory.mirror ) {
      return Availability.Unavailable;
    }

    if (!this.canReachOutcast() && !(this.isAgahnimDefeated() && inventory.moonPearl && inventory.hammer)) {
      return Availability.Unavailable;
    }

    return Availability.Available;
  }

  private hasGraveyardCliffAccess(): Availability {
    return this.canReachOutcast() && this._inventory.mirror ? Availability.Available : Availability.Unavailable;
  }

  private hasCheckerboardCaveAccess(): Availability {
    const inventory = this._inventory;
    return inventory.flute && inventory.mirror && inventory.glove === Glove.Titan ? Availability.Available : Availability.Unavailable;
  }

  private hasLibraryAccess(): Availability {
    return this._inventory.boots ? Availability.Available : Availability.Visible;
  }

  private hasSpectacleRockAccess(): Availability {
    if ( !this._inventory.hasDeathMountainAccess() ) {
      return Availability.Unavailable;
    }

    if ( !this._inventory.mirror) {
      return Availability.Visible;
    }

    return this._inventory.hasMountainSavePoint() ? Availability.Available : Availability.Glitches;
  }

  private hasFloatingIslandAccess(): Availability {
    const inventory = this._inventory;
    if ( !inventory.hasDeathMountainAccess() ) {
      return Availability.Unavailable;
    }

    if ( !(inventory.hookshot || ( inventory.hammer && inventory.mirror ) ) ) {
      return Availability.Unavailable;
    }

    if ( !(inventory.mirror && inventory.moonPearl && inventory.glove === Glove.Titan)) {
      return Availability.Visible;
    }

    return this._inventory.hasMountainSavePoint() ? Availability.Available : Availability.Glitches;
  }

  private hasDesertWestLedgeAccess(): Availability {
    const inventory = this._inventory;
    return inventory.book || inventory.flute && inventory.glove === Glove.Titan ? Availability.Available : Availability.Visible;
  }

  private hasLakeHyliaIslandAccess(): Availability {
    const inventory = this._inventory;
    if ( !inventory.flippers) {
      return Availability.Unavailable;
    }

    if (!inventory.moonPearl) {
      return Availability.Visible;
    }

    if (!inventory.mirror) {
      return Availability.Visible;
    }

    return ( this.isAgahnimDefeated() || inventory.glove === Glove.Titan || ( inventory.hasGlove() && inventory.hammer ) ) ?
      Availability.Available :
      Availability.Visible;
  }

  private hasZoraLedgeAccess(): Availability {
    if ( this._inventory.flippers ) {
      return Availability.Available;
    }

    return this._inventory.hasGlove() ? Availability.Visible : Availability.Unavailable;
  }

  private hasBuriedItemAccess(): Availability {
    return this._inventory.shovel ? Availability.Available : Availability.Unavailable;
  }

  private hasSewerEscapeSideRoomAccess(): Availability {
    if ( this._settings.mode === Mode.Standard || this._inventory.hasGlove() ) {
      return Availability.Available;
    }

    return this._inventory.lantern ? Availability.Possible : Availability.Glitches;
  }

  private hasMadBatterAccess(): Availability {
    const inventory = this._inventory;
    const canReach = inventory.hammer || ( inventory.glove === Glove.Titan && inventory.mirror && inventory.moonPearl );

    if ( !canReach ) {
      return Availability.Unavailable;
    }

    if ( inventory.powder ) {
      return Availability.Available;
    }

    return inventory.mushroom ? Availability.Glitches : Availability.Unavailable;
  }

  private hasDwarfAccess(): Availability {
    return this._inventory.moonPearl && this._inventory.glove === Glove.Titan ? Availability.Available : Availability.Unavailable;
  }

  private hasSewerDarkRoomAccess(): Availability {
    if ( this._settings.mode === Mode.Standard ) {
      return Availability.Available;
    }

    return this._inventory.lantern ? Availability.Available : Availability.Glitches;
  }

  private hasPedestalAccess(): Availability {
    if ( this._dungeons.hasAllPendants()) {
      return Availability.Available;
    }

    if ( this._inventory.book ) {
      return Availability.Visible;
    }

    return Availability.Unavailable;
  }

  getAvailability(id: LocationKey): Availability {
    return this._availabilityMap.get(id).call(this);
  }

  get itemLocations(): Map<LocationKey, ItemLocation> {
    return this._itemLocations;
  }

  getItemLocation(id: number): ItemLocation {
    return this.itemLocations.get(id);
  }
}
