import { Injectable } from '@angular/core';

import { ItemService } from '../../items/item.service';
import { DungeonService } from '../../dungeon/dungeon.service';
import { SettingsService } from '../../settings/settings.service';
import { BossService } from '../../boss/boss.service';

import { Availability } from '../availability';
import { Dungeon } from '../../dungeon/dungeon';
import { Location } from '../../dungeon/location';
import { EntranceLock } from '../../dungeon/entrance-lock';

import { DungeonLocation } from './dungeon-location';
import { DungeonLocations } from './dungeon-location.repository';

import { Sword } from '../../items/sword';
import { Glove } from '../../items/glove';
import { Shield } from '../../items/shield';

@Injectable()
export class DungeonLocationService {
  constructor(
    private _inventory: ItemService,
    private _dungeons: DungeonService,
    private _settings: SettingsService,
    private _boss: BossService
  ) {
    this._dungeonLocations = DungeonLocations;
    this._bossAvailability = new Map<Location, () => Availability>(
      [
        [Location.CastleTower, this.canNavigateCastleTower],
        [Location.EasternPalace, this.canNavigateEasternPalace],
        [Location.DesertPalace, this.canNavigateDesertPalace],
        [Location.TowerOfHera, this.canNavigateTowerOfHera],
        [Location.PalaceOfDarkness, this.canNavigatePalaceOfDarkness],
        [Location.SwampPalace, this.canNavigateSwampPalace],
        [Location.SkullWoods, this.canNavigateSkullWoods],
        [Location.ThievesTown, this.canNavigateThievesTown],
        [Location.IcePalace, this.canNavigateIcePalace],
        [Location.MiseryMire, this.canNavigateMiseryMire],
        [Location.TurtleRock, this.canNavigateTurtleRock],
        [Location.GanonsTower, this.canNavigateGanonsTower]
      ]
    );

    this._chestAvailability = new Map<Location, () => Availability>(
      [
        [Location.CastleTower, this.canRaidCastleTower],
        [Location.EasternPalace, this.canRaidEasternPalace],
        [Location.DesertPalace, this.canRaidDesertPalace],
        [Location.TowerOfHera, this.canRaidTowerOfHera],
        [Location.PalaceOfDarkness, this.canRaidPalaceOfDarkness],
        [Location.SwampPalace, this.canRaidSwampPalace],
        [Location.SkullWoods, this.canRaidSkullWoods],
        [Location.ThievesTown, this.canRaidThievesTown],
        [Location.IcePalace, this.canRaidIcePalace],
        [Location.MiseryMire, this.canRaidMiseryMire],
        [Location.TurtleRock, this.canRaidTurtleRock],
        [Location.GanonsTower, this.canRaidGanonsTower]
      ]
    );
  }

  private _bossAvailability: Map<Location, () => Availability>;
  private _chestAvailability: Map<Location, () => Availability>;
  private _dungeonLocations: Map<Location, DungeonLocation>;

  private canEnterCastleTower(): Availability {
    const items = this._inventory;
    if ( !!items.cape ) {
      return Availability.Available;
    }

    if ( this._settings.isSwordless() ) {
      if ( !!items.hammer ) {
        return Availability.Available;
      }
    }

    if ( items.sword !== Sword.None && items.sword !== Sword.Wooden ) {
      return Availability.Available;
    }

    return Availability.Unavailable;
  }

  private canNavigateCastleTower(): Availability {
    const items = this._inventory;

    const canEnter = this.canEnterCastleTower();
    if ( canEnter !== Availability.Available ) {
      return canEnter;
    }

    const canNavigateDungeon = items.hasReliableWeapon();

    const canBeatAgahnim = this._boss.canDefeatBoss(Location.CastleTower);

    if ( !canEnter || !canNavigateDungeon || !canBeatAgahnim ) {
      return Availability.Unavailable;
    }

    if ( this._settings.isKeysanity() ) {
      const dungeon = this._dungeons.getDungeon(Location.CastleTower);
      if ( dungeon.smallKeyCount !== dungeon.maxSmallKeys ) {
        return Availability.Unavailable;
      }
    }

    return items.lantern ? Availability.Available : Availability.Glitches;
  }

  private canRaidCastleTower(): Availability {
    if ( !this._settings.isKeysanity() ) {
      return this.canNavigateCastleTower();
    }

    const items = this._inventory;
    const dungeon = this._dungeons.getDungeon(Location.CastleTower);

    let hasMeleeWeapon: boolean;
    if ( this._settings.isSwordless() ) {
      hasMeleeWeapon = !!items.hammer;
    } else {
      hasMeleeWeapon = ( items.sword !== Sword.None && items.sword !== Sword.Wooden );
    }

    const canEnter = hasMeleeWeapon || items.cape;

    if ( !canEnter ) {
      return Availability.Unavailable;
    }

    if ( dungeon.smallKeyCount === 0 ) {
      return Availability.Possible;
    }

    return items.lantern ? Availability.Available : Availability.Glitches;
  }

  private canEnterEasternPalace(): Availability {
    return Availability.Available;
  }

  private canNavigateEasternPalace(): Availability {
    const dungeon = this._dungeons.getDungeon(Location.EasternPalace);
    if ( this._settings.isKeysanity() && !dungeon.hasBigKey ) {
      return Availability.Unavailable;
    }

    if ( !this._inventory.bow ) {
      return Availability.Unavailable;
    }

    if ( !this._boss.canDefeatBoss(dungeon.bossId)) {
      return Availability.Unavailable;
    }

    return this._inventory.lantern ? Availability.Available : Availability.Glitches;
  }

  private canRaidEasternPalaceInkeysanity( dungeon: Dungeon, items: ItemService): Availability {
    if ( dungeon.hasBigKey && items.bow && items.lantern ) {
      return Availability.Available;
    }

    if ( dungeon.totalChestCount >= 4 ) {
      return Availability.Possible;
    }

    if ( dungeon.totalChestCount >= 3 && !dungeon.hasBigKey && !items.lantern ) {
      return Availability.Glitches;
    }

    if ( dungeon.totalChestCount >= 3 && ( dungeon.hasBigKey || items.lantern ) ) {
      return Availability.Possible;
    }

    if ( dungeon.totalChestCount >= 2 && dungeon.hasBigKey ) {
      return items.lantern ? Availability.Possible : Availability.Glitches;
    }

    if ( dungeon.hasBigKey && items.bow && !items.lantern ) {
      return Availability.Glitches;
    }

    return Availability.Unavailable;
  }

  private canRaidEasternPalace(): Availability {
    const dungeon = this._dungeons.getDungeon(Location.EasternPalace);
    const items = this._inventory;
    if ( this._settings.isKeysanity() ) {
      return this.canRaidEasternPalaceInkeysanity( dungeon, items );
    }

    const count = this._settings.isRetro()
      ? dungeon.retroChestCount
      : dungeon.itemChestCount;

    if ( count <= 2 && !items.lantern ) {
      return Availability.Possible;
    }

    if ( count === 1 && !items.bow ) {
      return Availability.Possible;
    }

    return Availability.Available;
  }

  private canEnterDesertPalace(): Availability {
    const items = this._inventory;
    const canEnterLightWay = items.book;
    const canEnterDarkWay = items.hasDarkMireMirrorAccess();

    if ( !canEnterDarkWay && !canEnterLightWay ) {
      return Availability.Unavailable;
    }

    return Availability.Available;
  }

  private canNavigateDesertPalace(): Availability {
    const items = this._inventory;
    const dungeon = this._dungeons.getDungeon(Location.DesertPalace);
    const isKeysanity = this._settings.isKeysanity();

    const canEnter = this.canEnterDesertPalace();
    if ( canEnter !== Availability.Available ) {
      return canEnter;
    }

    if ( isKeysanity && !dungeon.hasBigKey ) {
      return Availability.Unavailable;
    }

    if (!items.hasFireSource()) {
      return Availability.Unavailable;
    }

    if ( !this._boss.canDefeatBoss(dungeon.bossId)) {
      return Availability.Unavailable;
    }

    if ( isKeysanity || items.boots ) {
      return Availability.Available;
    }

    return Availability.Possible;
  }

  private canRaidDesertPalaceInkeysanity( dungeon: Dungeon, items: ItemService ): Availability {
    const keys = dungeon.smallKeyCount;
    if ( dungeon.hasBigKey && keys === 1 && items.hasGlove() &&
      items.hasFireSource() && items.boots ) {
      return Availability.Available;
    }

    const remainingItems = dungeon.totalChestCount;
    let availableItems = 1;
    if ( !!items.boots ) {
      availableItems += 1;
    }

    if ( keys === 1 ) {
      // TODO: Ensure enemies can be defeated in this room.
      availableItems += 2;
    }

    if ( dungeon.hasBigKey ) {
      // TODO: Ensure enemies can be defeated in this far room.
      availableItems += ( ( items.hasGlove() && items.hasFireSource() ) ? 2 : 1 );
    }

    if ( dungeon.totalChestCount > dungeon.maxTotalChests - availableItems) {
      return Availability.Possible;
    }

    return Availability.Unavailable;
  }

  private canRaidDesertPalace(): Availability {
    const items = this._inventory;
    const dungeon = this._dungeons.getDungeon(Location.DesertPalace);

    const canEnter = this.canEnterDesertPalace();
    if ( canEnter !== Availability.Available ) {
      return canEnter;
    }

    if ( this._settings.isKeysanity() ) {
      return this.canRaidDesertPalaceInkeysanity( dungeon, items );
    }

    if ( items.hasGlove() && items.hasFireSource() && items.boots ) {
      return Availability.Available;
    }

    const count = this._settings.isRetro()
      ? dungeon.retroChestCount
      : dungeon.itemChestCount;

    return count > 1 && items.boots ? Availability.Available : Availability.Possible;
  }

  private canEnterTowerOfHera(): Availability {
    const items = this._inventory;

    if ( !items.hasDeathMountainAccess() ) {
      return Availability.Unavailable;
    }

    if ( !items.mirror && !( !!items.hookshot && !!items.hammer ) ) {
      return Availability.Unavailable;
    }

    return items.hasDeathMountainLogicalAccess()
      ? Availability.Available
      : Availability.Glitches;
  }

  private canNavigateTowerOfHera(): Availability {
    const dungeon = this._dungeons.getDungeon(Location.TowerOfHera);
    const items = this._inventory;

    const canEnter = this.canEnterTowerOfHera();
    if ( canEnter === Availability.Unavailable ) {
      return canEnter;
    }

    if ( !this._boss.canDefeatBoss(dungeon.bossId)) {
      return Availability.Unavailable;
    }

    if ( !this._settings.isKeysanity() ) {
      return this.canRaidTowerOfHera();
    }

    if ( !dungeon.hasBigKey ) {
      return Availability.Unavailable;
    }

    return canEnter;
  }

  private canRaidTowerOfHera(): Availability {
    const items = this._inventory;
    const dungeon = this._dungeons.getDungeon(Location.TowerOfHera);

    const canEnter = this.canEnterTowerOfHera();
    if ( canEnter === Availability.Unavailable ) {
      return canEnter;
    }

    if ( this._settings.isKeysanity() ) {
      if ( !items.hasDeathMountainAccess()) {
        return Availability.Unavailable;
      }

      const isInLogic = canEnter === Availability.Available;
      const canGetBasement = dungeon.smallKeyCount === 1 && items.hasFireSource();

      if ( dungeon.hasBigKey && items.hasMelee() && canGetBasement) {
        return !isInLogic ? Availability.Glitches : Availability.Available;
      }

      const chests = dungeon.totalChestCount;
      const keys = dungeon.smallKeyCount;

      if ( chests >= 5) {
        return !isInLogic ? Availability.Glitches : Availability.Possible;
      }

      if ( chests >= 4 && canGetBasement) {
        return !isInLogic ? Availability.Glitches : Availability.Possible;
      }

      if ( chests >= 3 && dungeon.hasBigKey ) {
        return !isInLogic ? Availability.Glitches : Availability.Possible;
      }

      if ( chests >= 2 && dungeon.hasBigKey && ( items.hasMelee() || canGetBasement ) ) {
        return !isInLogic ? Availability.Glitches : Availability.Possible;
      }

      return Availability.Unavailable;
    }

    if ( !items.hasFireSource() ) {
      return Availability.Possible;
    }

    return canEnter;
  }

  private canEnterPalaceOfDarkness(): Availability {
    const items = this._inventory;

    // Flute location 5.
    if ( !!items.hammer && items.hasGlove() ) {
      return Availability.Available;
    }

    if ( items.glove === Glove.Titan && items.moonPearl && items.flippers ) {
      return Availability.Available;
    }

    if ( this.isCastleTowerDefeated() ) {
      return !!items.lantern ? Availability.Available : Availability.Glitches;
    }

    return Availability.Unavailable;
  }

  private canNavigatePalaceOfDarkness(): Availability {
    const items = this._inventory;
    const dungeon = this._dungeons.getDungeon(Location.PalaceOfDarkness);

    const canEnter = this.canEnterPalaceOfDarkness();
    if ( canEnter === Availability.Unavailable ) {
      return canEnter;
    }

    const needsBunnyRevival = !items.moonPearl;
    const hasNoBombs = !items.bomb;
    const hasNoLamp = !items.lantern;

    const mustSequenceBreak = needsBunnyRevival || hasNoLamp;

    if ( !items.bow || !items.hammer ) {
      return Availability.Unavailable;
    }

    if ( !this._boss.canDefeatBoss(dungeon.bossId)) {
      return Availability.Unavailable;
    }

    if ( this._settings.isKeysanity() ) {
      if ( !dungeon.hasBigKey || dungeon.smallKeyCount === 0 ) {
        return Availability.Unavailable;
      }

      if ( dungeon.smallKeyCount < 6) {
        return !mustSequenceBreak ? Availability.Possible : Availability.Glitches;
      }
    }

    return !mustSequenceBreak ? Availability.Available : Availability.Glitches;
  }

  private canRaidPalaceOfDarknessInKeysanity( dungeon: Dungeon, items: ItemService ): Availability {
    if ( dungeon.smallKeyCount === 6 && dungeon.hasBigKey && items.hammer && items.bow && items.lantern ) {
      return Availability.Available;
    }

    // TODO: Possibly change the logic since it will be tricky here.
    let currentKeys = dungeon.smallKeyCount;
    let reachableChests = 1;
    let darkChests = 0;

    if ( items.bow ) {
      // The bow is required for the right hand side.
      reachableChests += 1;
      if ( items.bomb ) {
        reachableChests += 1;
      }
    }

    if ( items.bow && items.hammer ) {
      reachableChests += 2; // The bridge and dropdown are accessible.
    } else if ( currentKeys > 0 ) {
      reachableChests += 2;
      currentKeys -= 1; // The front door had to be used.
    }

    if ( currentKeys > 0 ) {
      reachableChests += 3; // Back side of POD: the likely ones at least.
      currentKeys -= 1;
      darkChests += 2;
    }

    if ( currentKeys > 0 ) {
      // The dark area with the big chest.
      const canGetBigChest = dungeon.hasBigKey && items.bomb;
      reachableChests += canGetBigChest ? 3 : 2;
      currentKeys -= 1;
      darkChests += canGetBigChest ? 3 : 2;
    }

    if ( items.bow && items.hammer && dungeon.hasBigKey && currentKeys > 0) {
      reachableChests += 1; // King Helmasaur: prioritized in a special way.
      currentKeys -= 1;
      darkChests += 1;
    }

    if ( currentKeys > 0) {
      reachableChests += 1; // Spike Room
      currentKeys -= 1;
    }

    if ( currentKeys > 0 && items.bomb ) {
      reachableChests += 1; // The vanilla big key chest overlooking the lobby
      currentKeys -= 1;
    }

    // Moon pearl is not needed if you use bunny revival.
    if ( dungeon.totalChestCount > dungeon.maxTotalChests - reachableChests) {
      if ( dungeon.totalChestCount > dungeon.maxTotalChests - (reachableChests - darkChests)) {
        return items.moonPearl ? Availability.Possible : Availability.Glitches;
      }
      return items.lantern && items.moonPearl ? Availability.Possible : Availability.Glitches;
    }

    return Availability.Unavailable;
  }

  private canRaidPalaceOfDarkness(): Availability {
    const items = this._inventory;
    const dungeon = this._dungeons.getDungeon( Location.PalaceOfDarkness );

    const canEnter = this.canEnterPalaceOfDarkness();
    if ( canEnter === Availability.Unavailable ) {
      return canEnter;
    }

    if ( this._settings.isKeysanity() ) {
      return this.canRaidPalaceOfDarknessInKeysanity( dungeon, items );
    }

    if ( !items.moonPearl ) {
      // Bunny revival.
      return Availability.Glitches;
    }

    const count = this._settings.isRetro()
      ? dungeon.retroChestCount
      : dungeon.itemChestCount;

    return !(items.bow && !!items.lantern) || count === 1 && !items.hammer ?
      Availability.Possible : Availability.Available;
  }

  private canEnterSwampPalace(): Availability {
    const items = this._inventory;

    // Remember that the mirror is not required to "enter".
    // Just getting to the location is enough.

    // Defeat Agahnim, then take the direct path.
    if ( this.isCastleTowerDefeated() && !!items.moonPearl && !!items.hammer ) {
      return Availability.Available;
    }

    // Travel counter-clockwise while staying dry.
    if ( this.isCastleTowerDefeated() && !!items.moonPearl && !!items.hookshot ) {
      return Availability.Available;
    }

    // Travel counter-clockwise while getting wet.
    if ( this.isCastleTowerDefeated() && !!items.moonPearl && !!items.flippers ) {
      return Availability.Available;
    }

    // Start south of home.
    if ( items.hasGlove() && items.hammer ) {
      return Availability.Available;
    }

    // Start at Skull Woods area.
    if ( items.glove === Glove.Titan ) {
      return Availability.Available;
    }

    return Availability.Unavailable;
  }

  private canNavigateSwampPalace(): Availability {
    const items = this._inventory;

    const canEnter = this.canEnterSwampPalace();
    if ( canEnter === Availability.Unavailable ) {
      return canEnter;
    }

    if ( !items.moonPearl || !items.mirror || !items.flippers ) {
      return Availability.Unavailable;
    }

    if ( !items.hammer || !items.hookshot ) {
      return Availability.Unavailable;
    }

    if ( !items.hasGlove() && !this.isCastleTowerDefeated() ) {
      return Availability.Unavailable;
    }

    const dungeon = this._dungeons.getDungeon(Location.SwampPalace);

    if ( !this._boss.canDefeatBoss(dungeon.bossId)) {
      return Availability.Unavailable;
    }

    if ( this._settings.isKeysanity() && dungeon.smallKeyCount === 0 ) {
      return Availability.Unavailable;
    }

    return Availability.Available;
  }

  private canRaidSwampPalaceInKeysanity( dungeon: Dungeon, items: ItemService ): Availability {
    if ( dungeon.hasBigKey && dungeon.smallKeyCount === 1 && items.hammer && items.hookshot ) {
      return Availability.Available;
    }

    const chests = dungeon.totalChestCount;
    const keys = dungeon.smallKeyCount;

    if ( chests === 10 ) {
      return Availability.Possible;
    }

    if ( chests >= 9 && keys === 1 ) {
      return Availability.Possible;
    }

    if ( chests >= 6 && keys === 1 && items.hammer ) {
      return Availability.Possible;
    }

    if ( chests >= 5 && dungeon.hasBigKey && keys === 1 && items.hammer ) {
      return Availability.Possible;
    }

    if ( chests >= 2 && keys === 1 && items.hammer && items.hookshot ) {
      return Availability.Possible;
    }

    return Availability.Unavailable;
  }

  private canRaidSwampPalace(): Availability {
    const items = this._inventory;
    const dungeon = this._dungeons.getDungeon(Location.SwampPalace);

    const canEnter = this.canEnterSwampPalace();
    if ( canEnter === Availability.Unavailable ) {
      return canEnter;
    }

    if ( !items.moonPearl || !items.mirror || !items.flippers ) {
      return Availability.Unavailable;
    }

    if ( this._settings.isKeysanity() ) {
      return this.canRaidSwampPalaceInKeysanity( dungeon, items );
    }

    const count = this._settings.isRetro()
      ? dungeon.retroChestCount
      : dungeon.itemChestCount;

    if ( count <= 2) {
      return !items.hammer || !items.hookshot ? Availability.Unavailable : Availability.Available;
    }

    if ( count <= 4) {
      return !items.hammer ? Availability.Unavailable : !items.hookshot ? Availability.Possible : Availability.Available;
    }

    if ( count <= 5) {
      return !items.hammer ? Availability.Unavailable : Availability.Available;
    }

    return !items.hammer ? Availability.Possible : Availability.Available;
  }

  private canEnterSkullWoods(): Availability {
    const items = this._inventory;

    // Defeat Agahnim, then travel counter-clockwise while staying dry.
    if ( this.isCastleTowerDefeated() && !!items.moonPearl && !!items.hookshot ) {
      return Availability.Available;
    }

    // Defeat Agahnim, then travel counter-clockwise while getting wet.
    if ( this.isCastleTowerDefeated() && !!items.moonPearl && !!items.flippers ) {
      return Availability.Available;
    }

    // Use the Skull Woods warp.
    if ( items.hasGlove() && items.hammer ) {
      return Availability.Available;
    }

    // Use the Skull Woods warp.
    if ( items.glove === Glove.Titan ) {
      return Availability.Available;
    }

    return Availability.Unavailable;
  }

  private canNavigateSkullWoods(): Availability {
    const items = this._inventory;

    const canEnter = this.canEnterSkullWoods();
    if ( canEnter === Availability.Unavailable ) {
      return canEnter;
    }

    const canAvoidBunnyRevival = items.moonPearl;

    if ( !items.fireRod ) {
      return Availability.Unavailable;
    }

    const dungeon = this._dungeons.getDungeon(Location.SkullWoods);
    if (!this._boss.canDefeatBoss(dungeon.bossId)) {
      return Availability.Unavailable;
    }

    if ( !this._settings.isSwordless() && items.sword === Sword.None ) {
      return Availability.Unavailable;
    }

    return canAvoidBunnyRevival ? Availability.Available : Availability.Glitches;
  }

  private canRaidSkullWoods(): Availability {
    const items = this._inventory;
    const dungeon = this._dungeons.getDungeon(Location.SkullWoods);
    const canEnter = this.canEnterSkullWoods();
    if ( canEnter === Availability.Unavailable ) {
      return canEnter;
    }

    const canAvoidBunnyRevival = !!items.moonPearl;

    if ( this._settings.isKeysanity() ) {
      const chests = dungeon.totalChestCount;
      const canGoBeyondCurtain = this._settings.isSwordless() || items.hasSword();

      if ( dungeon.hasBigKey && items.fireRod && canGoBeyondCurtain ) {
        return canAvoidBunnyRevival ? Availability.Available : Availability.Glitches;
      }

      if ( chests >= 4 ) {
        return canAvoidBunnyRevival ? Availability.Possible : Availability.Glitches;
      }

      if ( chests >= 3 && (dungeon.hasBigKey || items.fireRod )) {
        return canAvoidBunnyRevival ? Availability.Possible : Availability.Glitches;
      }

      if ( chests >= 2 && items.fireRod && ( canGoBeyondCurtain || dungeon.hasBigKey ) ) {
        return canAvoidBunnyRevival ? Availability.Possible : Availability.Glitches;
      }

      return Availability.Unavailable;
    }

    const tmp = items.fireRod ? Availability.Available : Availability.Possible;
    return canAvoidBunnyRevival ? tmp : Availability.Glitches;
  }

  private canEnterThievesTown(): Availability {
    return this.canEnterSkullWoods();
  }

  private canNavigateThievesTown(): Availability {
    const items = this._inventory;
    const dungeon = this._dungeons.getDungeon(Location.ThievesTown);

    const canEnter = this.canEnterSkullWoods();
    if ( canEnter === Availability.Unavailable ) {
      return canEnter;
    }

    // The roof must be blown open.
    if ( !items.bomb && !this._settings.isBossShuffleOn() ) {
      return Availability.Unavailable;
    }

    if ( !this._boss.canDefeatBoss(dungeon.bossId)) {
      return Availability.Unavailable;
    }

    if ( this._settings.isKeysanity() && !dungeon.hasBigKey) {
      return Availability.Unavailable;
    }

    return !!items.moonPearl ? Availability.Available : Availability.Glitches;
  }

  private canRaidThievesTown(): Availability {
    const dungeon = this._dungeons.getDungeon(Location.ThievesTown);
    const items = this._inventory;
    const canEnter = this.canEnterSkullWoods();
    if ( canEnter === Availability.Unavailable ) {
      return canEnter;
    }

    const canAvoidBunnyRevival = !!items.moonPearl;

    if ( this._settings.isKeysanity()) {
      const chests = dungeon.totalChestCount;
      const keys = dungeon.smallKeyCount;
      if ( dungeon.hasBigKey && keys === 1 && items.hammer ) {
        return canAvoidBunnyRevival ? Availability.Available : Availability.Glitches;
      }

      if ( chests >= 5) {
        return canAvoidBunnyRevival ? Availability.Possible : Availability.Glitches;
      }

      if ( chests >= 3 && dungeon.hasBigKey) {
        return canAvoidBunnyRevival ? Availability.Possible : Availability.Glitches;
      }

      if ( chests >= 2 && dungeon.hasBigKey && ( items.hasMelee() || items.hasCane() ) ) {
        return canAvoidBunnyRevival ? Availability.Possible : Availability.Glitches;
      }

      return Availability.Unavailable;
    }

    const count = this._settings.isRetro()
      ? dungeon.retroChestCount
      : dungeon.itemChestCount;

    const tmp = count === 1 && !items.hammer ?
      Availability.Possible : Availability.Available;

    return canAvoidBunnyRevival ? tmp : Availability.Glitches;
  }

  private canEnterIcePalace(): Availability {
    const items = this._inventory;
    if ( items.glove !== Glove.Titan ) {
      return Availability.Unavailable;
    }

    return !!items.flippers ? Availability.Available : Availability.Glitches;
  }

  private canNavigateIcePalace(): Availability {
    const items = this._inventory;
    const dungeon = this._dungeons.getDungeon(Location.IcePalace);

    const canEnter = this.canEnterIcePalace();
    if ( canEnter === Availability.Unavailable ) {
      return canEnter;
    }

    const canAvoidBunnyRevival = !!items.moonPearl;

    if ( !items.hammer ) {
      return Availability.Unavailable;
    }

    if ( !this._boss.canDefeatBoss(dungeon.bossId) ) {
      return Availability.Unavailable;
    }

    let tmp: Availability;

    if ( this._settings.isKeysanity() ) {
      const keys = dungeon.smallKeyCount;
      const hasRightKeys = keys > 0 && !!items.somaria || keys > 1;
      tmp = hasRightKeys ? Availability.Available : Availability.Possible;
      return canAvoidBunnyRevival && canEnter === Availability.Available
        ? tmp
        : Availability.Glitches;
    }

    tmp = items.hookshot || items.somaria ? Availability.Available : Availability.Glitches;
    return canAvoidBunnyRevival && canEnter === Availability.Available
      ? tmp
      : Availability.Glitches;
  }

  private canRaidIcePalace(): Availability {
    const items = this._inventory;
    const canEnter = this.canEnterIcePalace();
    if ( canEnter === Availability.Unavailable ) {
      return canEnter;
    }

    const canAvoidBunnyRevival = !!items.moonPearl;

    if ( !items.fireRod && !(items.bombos && items.hasMelee())) {
      return Availability.Unavailable;
    }

    if ( !this._settings.isKeysanity()) {
      return !!items.hammer && canAvoidBunnyRevival ? Availability.Available : Availability.Glitches;
    }

    const dungeon = this._dungeons.getDungeon(Location.IcePalace);
    const keys = dungeon.smallKeyCount;
    const chests = dungeon.totalChestCount;

    if ( dungeon.hasBigKey && items.hammer ) {
      const tmp = ( keys > 0 && items.somaria || keys > 1 ) ? Availability.Available : Availability.Possible;
      return canAvoidBunnyRevival ? tmp : Availability.Glitches;
    }

    if ( chests >= 5 ) {
      return canAvoidBunnyRevival ? Availability.Possible : Availability.Glitches;
    }

    if ( chests >= 4 && dungeon.hasBigKey ) {
      return canAvoidBunnyRevival ? Availability.Possible : Availability.Glitches;
    }

    if ( chests >= 2 && items.hammer ) {
      return canAvoidBunnyRevival ? Availability.Possible : Availability.Glitches;
    }

    return Availability.Unavailable;
  }

  private canEnterMiseryMire(): Availability {
    const items = this._inventory;

    // We must flute to 6.
    if ( !items.flute ) {
      return Availability.Unavailable;
    }

    // We must be able to lift the rock.
    if ( items.glove !== Glove.Titan ) {
      return Availability.Unavailable;
    }

    // We must have the moon pearl to use the medallion.
    if ( !items.moonPearl ) {
      return Availability.Unavailable;
    }

    // We must have the right weapon and the right medallion.
    const medallionState = this.medallionState( Location.MiseryMire );
    return medallionState;
  }

  private canNavigateMiseryMire(): Availability {
    const items = this._inventory;

    const canEnter = this.canEnterMiseryMire();

    if ( !items.somaria ) {
      return Availability.Unavailable;
    }

    if (!items.boots && !items.hookshot) {
      return Availability.Unavailable;
    }

    const medallionState = this.canEnterMiseryMire();
    if ( medallionState !== Availability.Available ) {
      return medallionState;
    }

    const dungeon = this._dungeons.getDungeon(Location.MiseryMire);
    if ( !this._boss.canDefeatBoss(dungeon.bossId)) {
      return Availability.Unavailable;
    }

    if ( this._settings.isKeysanity() ) {
      if ( !dungeon.hasBigKey) {
        return Availability.Unavailable;
      }

      return items.lantern ? Availability.Available : Availability.Glitches;
    }

    if ( !items.hasFireSource() ) {
      return Availability.Possible;
    }

    return items.lantern ? Availability.Available : Availability.Glitches;
  }

  private canRaidMiseryMireInKeysanity( dungeon: Dungeon, items: ItemService ): Availability {
    const chests = dungeon.totalChestCount;
    if ( items.lantern && items.somaria && dungeon.hasBigKey ) {
      return Availability.Available;
    }

    if ( chests >= 5) {
      return Availability.Possible;
    }

    const hasFire = items.hasFireSource();

    if ( chests >= 3 ) {
      if ( dungeon.hasBigKey || hasFire) {
        return Availability.Possible;
      }

      if ( dungeon.hasBigKey && items.somaria && !hasFire) {
        return Availability.Glitches;
      }
    }

    if ( chests >= 2 && items.fireRod && dungeon.hasBigKey) {
      return Availability.Possible;
    }

    if ( chests >= 1 && items.fireRod && !items.lantern && items.somaria && dungeon.hasBigKey) {
      return Availability.Glitches;
    }

    return Availability.Unavailable;
  }

  private canRaidMiseryMire(): Availability {
    const items = this._inventory;
    const dungeon = this._dungeons.getDungeon(Location.MiseryMire);

    if (!items.boots && !items.hookshot) {
      return Availability.Unavailable;
    }

    const medallionState = this.canEnterMiseryMire();
    if ( medallionState !== Availability.Available ) {
      return medallionState;
    }

    if ( this._settings.isKeysanity()) {
      return this.canRaidMiseryMireInKeysanity( dungeon, items );
    }

    let hasItems: boolean;
    const count = this._settings.isRetro()
      ? dungeon.retroChestCount
      : dungeon.itemChestCount;

    if ( count > 1 ) {
      hasItems = items.hasFireSource();
    } else {
      hasItems = !!items.lantern && !!items.somaria && !!items.bomb;
    }

    return hasItems ? Availability.Available : Availability.Possible;
  }

  private canEnterTurtleRock(): Availability {
    const items = this._inventory;

    // We must have the moon pearl to use the medallion.
    if ( !items.moonPearl ) {
      return Availability.Unavailable;
    }

    // We must hammer the pegs to open the warp.
    if ( !items.hammer ) {
      return Availability.Unavailable;
    }

    // We must be able to lift the rock.
    if ( items.glove !== Glove.Titan ) {
      return Availability.Unavailable;
    }

    // We need either the mirror or hookshot for traversal.
    if ( !items.mirror && !items.hookshot ) {
      return Availability.Unavailable;
    }

    // We must have the right weapon and the right medallion.
    const medallionState = this.medallionState( Location.TurtleRock );

    if ( medallionState === Availability.Unavailable ) {
      return medallionState;
    }

    // Either the lamp or flute is required for logical purposes.
    if ( !!items.lantern || !!items.flute ) {
      return medallionState;
    }

    return Availability.Glitches;
  }

  private canNavigateTurtleRock(): Availability {
    const items = this._inventory;

    const canEnter = this.canEnterTurtleRock();
    if ( canEnter === Availability.Unavailable ) {
      return canEnter;
    }

    const canEnterCleanly = canEnter !== Availability.Glitches;

    // The cane of somaria is needed just for the purposes of
    if ( !items.somaria ) {
      return Availability.Unavailable;
    }

    // In non entrance modes, a bomb is needed for one wall.
    if ( !items.bomb ) {
      return Availability.Unavailable;
    }

    // Both rods are required for the boss.
    if ( !items.iceRod || !items.fireRod ) {
      return Availability.Unavailable;
    }

    const dungeon = this._dungeons.getDungeon(Location.TurtleRock);
    if ( !this._boss.canDefeatBoss(dungeon.bossId)) {
      return Availability.Unavailable;
    }

    if ( this._settings.isKeysanity() ) {
      if ( !dungeon.hasBigKey || dungeon.smallKeyCount < 3) {
        return Availability.Unavailable;
      }

      if ( dungeon.smallKeyCount === 3) {
        return items.lantern && canEnterCleanly ? Availability.Possible : Availability.Glitches;
      }

      return items.lantern && canEnterCleanly ? Availability.Available : Availability.Glitches;
    }

    if ( !this.hasLaserBridgeSafety()) {
      return Availability.Possible;
    }

    return items.lantern && canEnterCleanly ? Availability.Available : Availability.Glitches;
  }

  private canRaidTurtleRockInKeysanity( dungeon: Dungeon, items: ItemService ): Availability {
    const chests = dungeon.totalChestCount;
    const keys = dungeon.smallKeyCount;
    const hasLaserSafety = this.hasLaserBridgeSafety();

    if ( dungeon.hasBigKey && keys === 4 && items.fireRod && items.iceRod && items.lantern && hasLaserSafety ) {
      return Availability.Available;
    }

    if ( chests >= 12) {
      return Availability.Possible;
    }

    if ( chests >= 10 && ( items.fireRod || keys >= 2 ) ) {
      return Availability.Possible;
    }

    if ( chests >= 9 && ( ( keys >= 1 && items.fireRod ) || ( keys >= 2 && dungeon.hasBigKey ) ) ) {
      return Availability.Possible;
    }

    if ( chests >= 8 && keys >= 2 && items.fireRod ) {
      return Availability.Possible;
    }

    if ( chests >= 7 && dungeon.hasBigKey && keys >= 2 && items.fireRod ) {
      return Availability.Possible;
    }

    if ( chests >= 5 && dungeon.hasBigKey && keys >= 2 && hasLaserSafety ) {
      return items.lantern ? Availability.Possible : Availability.Glitches;
    }

    if ( chests >= 4 && dungeon.hasBigKey && keys >= 3 && hasLaserSafety ) {
      return items.lantern ? Availability.Possible : Availability.Glitches;
    }

    if ( chests >= 3 && dungeon.hasBigKey) {
      if ( keys >= 2 && items.fireRod && hasLaserSafety ) {
        return items.lantern ? Availability.Possible : Availability.Glitches;
      }

      if ( keys === 4 && items.fireRod && items.iceRod) {
        return items.lantern ? Availability.Possible : Availability.Glitches;
      }
    }

    if ( chests >= 2 && dungeon.hasBigKey && keys >= 3 && items.fireRod && hasLaserSafety ) {
      return items.lantern ? Availability.Possible : Availability.Glitches;
    }

    return Availability.Unavailable;
  }

  private canRaidTurtleRock(): Availability {
    const items = this._inventory;

    const canEnter = this.canEnterTurtleRock();
    if ( canEnter === Availability.Unavailable ) {
      return canEnter;
    }

    const canEnterCleanly = canEnter !== Availability.Glitches;

    if ( !items.somaria ) {
      return Availability.Unavailable;
    }

    const dungeon = this._dungeons.getDungeon(Location.TurtleRock);
    const hasLaserSafety = this.hasLaserBridgeSafety();

    if ( this._settings.isKeysanity() ) {
      return this.canRaidTurtleRockInKeysanity( dungeon, items );
    }

    const darkAvailability = items.lantern ? Availability.Available : Availability.Glitches;

    const count = this._settings.isRetro()
      ? dungeon.retroChestCount
      : dungeon.itemChestCount;

    if ( count <= 1) {
      return !hasLaserSafety ? Availability.Unavailable : items.fireRod && items.iceRod ? darkAvailability : Availability.Possible;
    }
    if ( count <= 2) {
      return !hasLaserSafety ? Availability.Unavailable : items.fireRod ? darkAvailability : Availability.Possible;
    }

    if ( count <= 4) {
      return hasLaserSafety && items.fireRod && items.lantern ? Availability.Available : Availability.Possible;
    }

    return items.fireRod && items.lantern ? Availability.Available : Availability.Possible;
  }

  private canEnterGanonsTower(): Availability {
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

    const canClimbSuperBunnyCave = items.hookshot;
    const canAccessTurtleRock = items.hammer;

    if ( !canClimbSuperBunnyCave && !canAccessTurtleRock ) {
      return Availability.Unavailable;
    }

    return items.hasDeathMountainLogicalAccess()
      ? Availability.Available
      : Availability.Glitches;
  }

  private canNavigateGanonsTower(): Availability {
    const items = this._inventory;
    const canEnter = this.canEnterGanonsTower();
    if ( canEnter === Availability.Unavailable ) {
      return canEnter;
    }

    if ( !items.bow ) {
      return Availability.Unavailable;
    }

    if ( !items.hasFireSource() ) {
      return Availability.Unavailable;
    }

    const dungeon = this._dungeons.getDungeon(Location.GanonsTower);
    if ( !this._boss.canDefeatBoss(dungeon.bossId)) {
      return Availability.Unavailable;
    }

    if ( this._settings.isKeysanity() ) {
      if ( !dungeon.hasBigKey) {
        return Availability.Unavailable;
      }

      if ( dungeon.smallKeyCount < 3) {
        return Availability.Possible;
      }
    }

    // Not going through all of them right now.
    return canEnter;
  }

  private canRaidGanonsTower(): Availability {
    if ( !this._settings.isKeysanity() ) {
      return this.canNavigateGanonsTower();
    }

    const items = this._inventory;
    const canEnter = this.canEnterGanonsTower();
    if ( canEnter === Availability.Unavailable ) {
      return canEnter;
    }

    const dungeon = this._dungeons.getDungeon(Location.GanonsTower);
    const chests = dungeon.totalChestCount;
    const keys = dungeon.smallKeyCount;
    const hasFireSource = items.hasFireSource();

    if ( dungeon.hasBigKey && keys > 2 && items.bow && items.hookshot && hasFireSource && items.somaria) {
      return Availability.Available;
    }

    // Start counting keys and chests.
    let currentKeys = keys + 1; // free key on the left side.
    let reachableChests = 2; // two chests on the right are free.

    if ( items.boots ) {
      reachableChests += 1; // The torch.
    }

    if ( items.somaria ) {
      reachableChests += 1; // Tile Room.
    }

    if ( items.hookshot && items.hammer ) {
      reachableChests += 4; // Skeleton room, west side.
    }

    if ( dungeon.hasBigKey && items.bow && hasFireSource ) {
      reachableChests += 2;
      currentKeys += 1; // The mini helmasaur room.
    }

    // Now for some easy chests with few keys needed.
    if ( items.somaria && items.fireRod && currentKeys > 0) {
      reachableChests += 4; // End of right side. Free key in the room beyond.
    }

    if ( items.hookshot && items.hammer ) {
      reachableChests += 1; // Firebar Room. A key is used, but a freebie one is found on left side.
    }

    if ( dungeon.hasBigKey && items.bow && hasFireSource && currentKeys > 0 ) {
      reachableChests += 1;
      currentKeys -= 1; // Consolation chest.
    }

    // Now for chests that need a key to be spent.
    if ( currentKeys > 0) {
      if ( items.hookshot && items.hammer ) {
        // Rando room + Armos Knights area.
        reachableChests += dungeon.hasBigKey ? 9 : 8;
        currentKeys -= 1;
      } else if ( items.somaria && items.fireRod ) {
        // Just Armos Knights.
        reachableChests += dungeon.hasBigKey ? 5 : 4;
        currentKeys -= 1;
      }
    }

    if ( ( items.hookshot || items.bombos ) && items.hammer && currentKeys > 0 ) {
      reachableChests += 1;
      currentKeys -= 1; // Map room with double fire bars.
    }

    if ( chests > (dungeon.maxTotalChests - reachableChests ) ) {
      return Availability.Possible;
    }

    return Availability.Unavailable;
  }

  private getCorrectDungeons(): Dungeon[] {
    if ( this._settings.isGoalAllDungeons() ) {
      return this._dungeons.allDungeons();
    }

    if ( this._settings.isGoalPedestal() ) {
      return this._dungeons.pendantDungeons();
    }

    return this._dungeons.crystalDungeons();
  }

  private isDungeonCountCorrect( dungeons: Dungeon[] ): boolean {
    if ( this._settings.isGoalAllDungeons() ) {
      return true;
    }

    if ( this._settings.isGoalPedestal() ) {
      return dungeons.length >= 3;
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

    if ( !inventory.hasPrimaryMelee() ) {
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
    const geographicDungeon = this._dungeons.getDungeon(id);
    const bossId = geographicDungeon.bossId;
    if ( bossId === id ) {
      return geographicDungeon.bossName;
    }

    const bossDungeon = this._dungeons.getDungeon(bossId);
    return bossDungeon.bossName;
  }

  hasChestsOrBossClaimed(id: Location): boolean {
    const dungeon = this._dungeons.getDungeon(id);

    if ( this._settings.isKeysanity() ) {
      return dungeon.totalChestCount === 0;
    }

    if ( dungeon.hasDungeonEndingReward ) {
      const count = this._settings.isRetro()
        ? dungeon.retroChestCount
        : dungeon.itemChestCount;
      return count === 0;
    }

    return dungeon.isBossDefeated;
  }

  isBossDefeated(id: Location): boolean {
    return this._dungeons.getDungeon(id).isBossDefeated;
  }

  reset(): void {
    this._dungeonLocations.forEach( l => {
    } );
  }
}
