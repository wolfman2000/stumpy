import { Injectable } from '@angular/core';

import { ItemService } from '../../items/item.service';
import { DungeonService } from '../../dungeon/dungeon.service';
import { SettingsService } from '../../settings/settings.service';

import { Availability } from '../availability';
import { Dungeon } from '../../dungeon/dungeon';
import { Location } from '../../dungeon/location';
import { EntranceLock } from '../../dungeon/entrance-lock';

import { DungeonLocation } from './dungeon-location';
import { DungeonLocations } from './dungeon-location.repository';

import { Goal } from '../../settings/goal';
import { Mode } from '../../settings/mode';
import { Sword } from '../../items/sword';
import { Glove } from '../../items/glove';
import { Shield } from '../../items/shield';

@Injectable()
export class DungeonLocationService {
  constructor(
    private _inventory: ItemService,
    private _dungeons: DungeonService,
    private _settings: SettingsService
  ) {
    this._dungeonLocations = DungeonLocations;
    this._bossAvailability = new Map<Location, () => Availability>(
      [
        [Location.CastleTower, this.isCastleTowerAvailable],
        [Location.EasternPalace, this.isArmosKnightsAvailable],
        [Location.DesertPalace, this.isLanmolasAvailable],
        [Location.TowerOfHera, this.isMoldormAvailable],
        [Location.PalaceOfDarkness, this.isHelmasaurKingAvailable],
        [Location.SwampPalace, this.isArgghusAvailable],
        [Location.SkullWoods, this.isMothulaAvailable],
        [Location.ThievesTown, this.isBlindAvailable],
        [Location.IcePalace, this.isKholdstareAvailable],
        [Location.MiseryMire, this.isVitreousAvailable],
        [Location.TurtleRock, this.isTrinexxAvailable],
        [Location.GanonsTower, this.isAgahnimAvailable]
      ]
    );

    this._chestAvailability = new Map<Location, () => Availability>(
      [
        [Location.CastleTower, this.isCastleTowerAvailable],
        [Location.EasternPalace, this.isArmosKnightsRaidable],
        [Location.DesertPalace, this.isLanmolasRaidable],
        [Location.TowerOfHera, this.isMoldormRaidable],
        [Location.PalaceOfDarkness, this.isHelmasaurKingRaidable],
        [Location.SwampPalace, this.isArgghusRaidable],
        [Location.SkullWoods, this.isMothulaRaidable],
        [Location.ThievesTown, this.isBlindRaidable],
        [Location.IcePalace, this.isKholdstareRaidable],
        [Location.MiseryMire, this.isVitreousRaidable],
        [Location.TurtleRock, this.isTrinexxRaidable],
        [Location.GanonsTower, this.isAgahnimAvailable]
      ]
    );
  }

  private _bossAvailability: Map<Location, () => Availability>;
  private _chestAvailability: Map<Location, () => Availability>;
  private _dungeonLocations: Map<Location, DungeonLocation>;

  private isCastleTowerSwordlessAvailable(): Availability {
    if ( !(this._inventory.hammer || this._inventory.cape) ) {
      return Availability.Unavailable;
    }

    if ( !this._inventory.net ) {
      return Availability.Unavailable;
    }

    return this._inventory.lantern ? Availability.Available : Availability.Glitches;
  }

  private isCastleTowerAvailable(): Availability {
    if ( this._settings.mode === Mode.Swordless ) {
      return this.isCastleTowerSwordlessAvailable();
    }

    const items = this._inventory;

    const canEnter = items.cape || ( items.sword !== Sword.None && items.sword !== Sword.Wooden );
    const canBeatAgahnim = items.net || items.sword !== Sword.None;

    if ( !canEnter || !canBeatAgahnim ) {
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

    return items.hasDeathMountainLogicalAccess() ? Availability.Available : Availability.Glitches;
  }

  private isHelmasaurKingAvailable(): Availability {
    const items = this._inventory;

    if ( !items.moonPearl || !items.bow || !items.hammer ) {
      return Availability.Unavailable;
    }

    if ( !this.isCastleTowerDefeated() && !items.hasGlove()) {
      return Availability.Unavailable;
    }

    return items.lantern ? Availability.Available : Availability.Glitches;
  }

  private isHelmasaurKingRaidable(): Availability {
    const items = this._inventory;
    const dungeon = this._dungeons.getDungeon( Location.PalaceOfDarkness );

    if ( !items.moonPearl ) {
      return Availability.Unavailable;
    }

    if ( !this.isCastleTowerDefeated() && !(!!items.hammer && items.hasGlove()) &&
      !(items.glove === Glove.Titan && !!items.flippers) ) {
      return Availability.Unavailable;
    }

    return !(items.bow && !!items.lantern) || dungeon.chestCount === 1 && !items.hammer ?
      Availability.Possible : Availability.Available;
  }

  private isArgghusAvailable(): Availability {
    const items = this._inventory;

    if ( !items.moonPearl || !items.mirror || !items.flippers ) {
      return Availability.Unavailable;
    }

    if ( !items.hammer || !items.hookshot ) {
      return Availability.Unavailable;
    }

    if ( !items.hasGlove() && !this.isCastleTowerDefeated() ) {
      return Availability.Unavailable;
    }

    return Availability.Available;
  }

  private isArgghusRaidable(): Availability {
    const items = this._inventory;
    const dungeon = this._dungeons.getDungeon(Location.SwampPalace);

    if ( !items.moonPearl || !items.mirror || !items.flippers ) {
      return Availability.Unavailable;
    }

    if ( !this.canReachOutcast() && !(this.isCastleTowerDefeated && items.hammer)) {
      return Availability.Unavailable;
    }

    if ( dungeon.chestCount <= 2) {
      return !items.hammer || !items.hookshot ? Availability.Unavailable : Availability.Available;
    }

    if ( dungeon.chestCount <= 4) {
      return !items.hammer ? Availability.Unavailable : !items.hookshot ? Availability.Possible : Availability.Available;
    }

    if ( dungeon.chestCount <= 5) {
      return !items.hammer ? Availability.Unavailable : Availability.Available;
    }

    return !items.hammer ? Availability.Possible : Availability.Available;
  }

  private isMothulaAvailable(): Availability {
    if ( !this.canReachOutcast()) {
      return Availability.Unavailable;
    }

    const items = this._inventory;
    if ( !items.fireRod ) {
      return Availability.Unavailable;
    }

    if ( this._settings.mode !== Mode.Swordless && items.sword === Sword.None ) {
      return Availability.Unavailable;
    }

    return Availability.Available;
  }

  private isMothulaRaidable(): Availability {
    if ( !this.canReachOutcast()) {
      return Availability.Unavailable;
    }

    return this._inventory.fireRod ? Availability.Available : Availability.Possible;
  }

  private isBlindAvailable(): Availability {
    const items = this._inventory;
    if (!items.hasMelee() && !items.hasCane()) {
      return Availability.Unavailable;
    }

    if ( !this.canReachOutcast()) {
      return Availability.Unavailable;
    }

    return Availability.Available;
  }

  private isBlindRaidable(): Availability {
    if ( !this.canReachOutcast()) {
      return Availability.Unavailable;
    }

    return this._dungeons.getDungeon(Location.ThievesTown).chestCount === 1 && !this._inventory.hammer ?
      Availability.Possible : Availability.Available;
  }

  private isKholdstareAvailable(): Availability {
    const items = this._inventory;
    if (!items.moonPearl || !items.flippers || items.glove !== Glove.Titan || !items.hammer) {
      return Availability.Unavailable;
    }

    if ( !items.fireRod && !(items.bombos && items.hasMelee())) {
      return Availability.Unavailable;
    }

    return items.hookshot || items.somaria ? Availability.Available : Availability.Glitches;
  }

  private isKholdstareRaidable(): Availability {
    const items = this._inventory;
    if (!items.moonPearl || !items.flippers || items.glove !== Glove.Titan ) {
      return Availability.Unavailable;
    }

    if ( !items.fireRod && !(items.bombos && items.hasMelee())) {
      return Availability.Unavailable;
    }

    return items.hammer ? Availability.Available : Availability.Glitches;
  }

  private isVitreousAvailable(): Availability {
    const items = this._inventory;
    if ( !items.hasMeleeOrBow()) {
      return Availability.Unavailable;
    }

    if (!items.moonPearl || items.glove !== Glove.Titan || !items.somaria) {
      return Availability.Unavailable;
    }

    if (!items.boots && !items.hookshot) {
      return Availability.Unavailable;
    }

    const medallionState = this.medallionState( Location.MiseryMire );
    if ( medallionState !== Availability.Available ) {
      return medallionState;
    }

    if ( !items.hasFireSource() ) {
      return Availability.Possible;
    }

    return items.lantern ? Availability.Available : Availability.Glitches;
  }

  private isVitreousRaidable(): Availability {
    const items = this._inventory;

    if (!items.moonPearl || items.glove !== Glove.Titan) {
      return Availability.Unavailable;
    }

    if (!items.boots && !items.hookshot) {
      return Availability.Unavailable;
    }

    const medallionState = this.medallionState( Location.MiseryMire );
    if ( medallionState !== Availability.Available ) {
      return medallionState;
    }

    let hasItems: boolean;
    if ( this._dungeons.getDungeon( Location.MiseryMire ).chestCount > 1) {
      hasItems = items.hasFireSource();
    } else {
      hasItems = !!items.lantern && !!items.somaria;
    }

    return hasItems ? Availability.Available : Availability.Possible;
  }

  private isTrinexxAvailable(): Availability {
    const items = this._inventory;
    if (!items.moonPearl || !items.hammer || items.glove !== Glove.Titan || !items.somaria) {
      return Availability.Unavailable;
    }

    if (!items.hookshot && !items.mirror) {
      return Availability.Unavailable;
    }

    if (!items.iceRod || !items.fireRod) {
      return Availability.Unavailable;
    }

    const medallionState = this.medallionState(Location.TurtleRock);
    if ( medallionState !== Availability.Available ) {
      return medallionState;
    }

    if ( !this.hasLaserBridgeSafety()) {
      return Availability.Possible;
    }

    return items.lantern ? Availability.Available : Availability.Glitches;
  }

  private isTrinexxRaidable(): Availability {
    const items = this._inventory;
    if (!items.moonPearl || !items.hammer || items.glove !== Glove.Titan || !items.somaria) {
      return Availability.Unavailable;
    }

    if (!items.hookshot && !items.mirror) {
      return Availability.Unavailable;
    }

    const medallionState = this.medallionState(Location.TurtleRock);
    if ( medallionState !== Availability.Available ) {
      return medallionState;
    }

    const hasLaserSafety = this.hasLaserBridgeSafety();
    const darkAvailability = items.lantern ? Availability.Available : Availability.Glitches;
    const dungeon = this._dungeons.getDungeon(Location.TurtleRock);

    if ( dungeon.chestCount <= 1) {
      return !hasLaserSafety ? Availability.Unavailable : items.fireRod && items.iceRod ? darkAvailability : Availability.Possible;
    }
    if ( dungeon.chestCount <= 2) {
      return !hasLaserSafety ? Availability.Unavailable : items.fireRod ? darkAvailability : Availability.Possible;
    }

    if ( dungeon.chestCount <= 4) {
      return hasLaserSafety && items.fireRod && items.lantern ? Availability.Available : Availability.Possible;
    }

    return items.fireRod && items.lantern ? Availability.Available : Availability.Possible;
  }

  private isAgahnimAvailable(): Availability {
    const dungeons = this.getCorrectDungeons();
    if ( !this.isDungeonCountCorrect( dungeons ) ) {
      return Availability.Unavailable;
    }

    if ( !this.arePriorBossesDefeated()) {
      return Availability.Unavailable;
    }

    const items = this._inventory;

    if ( items.glove !== Glove.Titan ) {
      return Availability.Unavailable;
    }

    if ( !items.moonPearl ) {
      return Availability.Unavailable;
    }

    // Add check for dark death mountain check here.
    const canClimbSuperBunnyCave = items.hookshot;
    const canAccessTurtleRock = items.hammer;

    if ( !canClimbSuperBunnyCave && !canAccessTurtleRock ) {
      return Availability.Unavailable;
    }

    if ( !items.bow ) {
      return Availability.Unavailable;
    }

    if ( !items.hasFireSource() ) {
      return Availability.Unavailable;
    }

    // Not going through all of them right now.
    return Availability.Available;
  }

  private getCorrectDungeons(): Dungeon[] {
    if ( this._settings.goal === Goal.AllDungeons ) {
      return this._dungeons.allDungeons();
    }

    return this._dungeons.crystalDungeons();
  }

  private isDungeonCountCorrect( dungeons: Dungeon[] ): boolean {
    if ( this._settings.goal === Goal.AllDungeons ) {
      return true;
    }

    return dungeons.length >= 7;
  }

  private arePriorBossesDefeated(): boolean {
    // Order doesn't matter. Just make sure the crystal ones are covered.
    return this._dungeons.crystalDungeons().every( e => e.isBossDefeated );
  }

  private hasLaserBridgeSafety(): boolean {
    return !!this._inventory.byrna || !!this._inventory.cape || this._inventory.shield === Shield.Mirror;
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

  private isCastleTowerDefeated(): boolean {
    return this._dungeons.getDungeon(Location.CastleTower).isBossDefeated;
  }

  private canReachOutcast(): boolean {
    const inventory = this._inventory;
    if ( !inventory.moonPearl ) {
      return false;
    }

    return (
      inventory.glove === Glove.Titan ||
      inventory.hasGlove() && !!inventory.hammer ||
      this.isCastleTowerDefeated() && !!inventory.hookshot && (
        !!inventory.hammer || inventory.hasGlove() || !!inventory.flippers
      )
    );
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

  reset(): void {
    this._dungeonLocations.forEach( l => {
    } );
  }
}
