import { Injectable } from '@angular/core';

import { Availability } from '../availability';
import { LocationKey } from './location-key';
import { ItemLocation } from './item-location';

import { Glove } from '../../items/glove';
import { Sword } from '../../items/sword';

import { ItemService } from '../../items/item.service';
import { DungeonService } from '../../dungeon/dungeon.service';
import { SettingsService } from '../../settings/settings.service';

import { ItemLocations } from './item-location.repository';

import { EntranceLock } from '../../dungeon/entrance-lock';
import { Location } from '../../dungeon/location';
import { Mode } from '../../settings/mode';

@Injectable()
export class ItemLocationService {
  constructor(
    private _inventory: ItemService,
    private _dungeons: DungeonService,
    private _settings: SettingsService
  ) {
    this._itemLocations = ItemLocations;
    this._availabilityMap = new Map<LocationKey, () => Availability>(
      [
        [LocationKey.KingsTomb, this.getKingsTombAvailability],
        [LocationKey.LightWorldSwamp, ItemLocationService.always],
        [LocationKey.LinksHouse, ItemLocationService.always],
        [LocationKey.SpiralCave, this.getEastDeathMountainAvailability],
        [LocationKey.MimicCave, this.getMimicCaveAvailability],
        [LocationKey.Tavern, ItemLocationService.always],
        [LocationKey.ChickenHouse, ItemLocationService.always],
        [LocationKey.AginahsCave, ItemLocationService.always],
        [LocationKey.SahasrahlasHut, ItemLocationService.always],
        [LocationKey.KakarikoWell, ItemLocationService.always],
        [LocationKey.BlindsHut, ItemLocationService.always],
        [LocationKey.ParadoxCave, this.getEastDeathMountainAvailability],
        [LocationKey.BonkRocks, this.getBonkRocksAvailability],
        [LocationKey.MiniMoldormCave, ItemLocationService.always],
        [LocationKey.IceRodCave, ItemLocationService.always],
        [LocationKey.BottleVendor, ItemLocationService.always],
        [LocationKey.SahasrahlasReward, this.getGreenPendantAvailability],
        [LocationKey.SickKid, this.getSickKidAvailability],
        [LocationKey.BridgeHideout, this.getBridgeAccessAvailability],
        [LocationKey.EtherTablet, this.getEtherTabletAvailability],
        [LocationKey.BombosTablet, this.getBombosTabletAvailability],
        [LocationKey.KingZora, this.getKingZoraAvailability],
        [LocationKey.LostOldMan, this.getOldManAvailability],
        [LocationKey.PotionShop, this.getPotionShopAvailability],
        [LocationKey.ForestHideout, ItemLocationService.always],
        [LocationKey.LumberjackTree, this.getLumberjackAvailability],
        [LocationKey.SpectacleRockCave, this.getDeathMountainLogicalAccessibility],
        [LocationKey.MirrorCave, this.getMirrorCaveAvailability],
        [LocationKey.GraveyardCliffCave, this.getGraveyardCliffAvailability],
        [LocationKey.CheckerboardCave, this.getCheckerboardCaveAvailability],
        [LocationKey.Library, this.getLibraryAvailability],
        [LocationKey.Mushroom, ItemLocationService.always],
        [LocationKey.SpectacleRock, this.getSpectacleRockAvailability],
        [LocationKey.FloatingIsland, this.getFloatingIslandAvailability],
        [LocationKey.RaceMinigame, ItemLocationService.always],
        [LocationKey.DesertWestLedge, this.getDesertWestLedgeAvailability],
        [LocationKey.LakeHyliaIsland, this.getLakeHyliaIslandAvailability],
        [LocationKey.ZoraLedge, this.getZoraLedgeAvailability],
        [LocationKey.BuriedItem, this.getBuriedItemAvailability],
        [LocationKey.SewerEscapeSideRoom, this.getSewerEscapeSideRoomAvailability],
        [LocationKey.CastleSecretEntrance, ItemLocationService.always],
        [LocationKey.CastleDungeon, ItemLocationService.always],
        [LocationKey.Sanctuary, ItemLocationService.always],
        [LocationKey.MadBatter, this.getMadBatterAvailability],
        [LocationKey.DwarfEscort, this.getDwarfAvailability],
        [LocationKey.MasterSwordPedestal, this.getPedestalAvailability],
        [LocationKey.SewerEscapeDarkRoom, this.getSewerDarkRoomAvailability],
        [LocationKey.WaterfallOfWishing, this.getWaterfallOfWishingAvailability],
        [LocationKey.BombableHut, this.getOutcastAvailability],
        [LocationKey.CShapedHouse, this.getOutcastAvailability],
        [LocationKey.MireHut, this.getDarkMireAvailability],
        [LocationKey.SuperBunnyCave, this.getSuperBunnyCaveAvailability],
        [LocationKey.SpikeCave, this.getSpikeCaveAvailability],
        [LocationKey.HypeCave, this.getHypeCaveAvailability],
        [LocationKey.HookshotCaveBottom, this.getHookshotCaveBottomAvailability],
        [LocationKey.HookshotCaveTop, this.getHookshotCaveTopAvailability],
        [LocationKey.TreasureChestMinigame, this.getOutcastAvailability],
        [LocationKey.StumpKid, this.getHypeCaveAvailability],
        [LocationKey.PurpleChest, this.getPurpleChestAvailability],
        [LocationKey.Catfish, this.getCatfishAvailability],
        [LocationKey.HammerPegCave, this.getHammerCaveAvailability],
        [LocationKey.BumperCave, this.getBumperCaveAvailability],
        [LocationKey.Pyramid, this.getPyramidAvailability],
        [LocationKey.DiggingGame, this.getHypeCaveAvailability],
        [LocationKey.PyramidFairy, this.getFatFairyAvailability]
      ]
    );
  }

  private _itemLocations: Map<LocationKey, ItemLocation>;
  private _availabilityMap: Map<LocationKey, () => Availability>;

  private _standardClaimedLocations: Array<LocationKey> = [
    LocationKey.LinksHouse,
    LocationKey.CastleSecretEntrance,
    LocationKey.CastleDungeon,
    LocationKey.Sanctuary,
    LocationKey.SewerEscapeDarkRoom
  ];

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

  private getDeathMountainLogicalVisibleAccessibility(): Availability {
    if ( !this._inventory.hasDeathMountainAccess()) {
      return Availability.Unavailable;
    }

    return this._inventory.hasDeathMountainLogicalAccess() ? Availability.Visible : Availability.GlitchesVisible;
  }

  private getDeathMountainLogicalAccessibility(): Availability {
    if ( !this._inventory.hasDeathMountainAccess()) {
      return Availability.Unavailable;
    }

    return this._inventory.hasDeathMountainLogicalAccess() ? Availability.Available : Availability.Glitches;
  }

  private hasMedallionWeapon(): boolean {
    return ( this._settings.mode === Mode.Swordless && !!this._inventory.hammer ) ||
      this._inventory.sword !== Sword.None && this._inventory.sword !== Sword.Wooden;
  }

  private isAgahnimDefeated(): boolean {
    return this._dungeons.agahnimTower.isBossDefeated;
  }

  private hasSouthDarkWorldFromPyramidAccess(): boolean {
    return this.isAgahnimDefeated() && !!this._inventory.moonPearl && !!this._inventory.hammer;
  }

  private canReachOutcast(): boolean {
    const inventory = this._inventory;
    if ( !inventory.moonPearl ) {
      return false;
    }

    return (
      inventory.glove === Glove.Titan ||
      inventory.hasGlove() && !!inventory.hammer ||
      this.isAgahnimDefeated() && !!inventory.hookshot && (
        !!inventory.hammer || inventory.hasGlove() || !!inventory.flippers
      )
    );
  }

  private getKingsTombAvailability(): Availability {
    const items = this._inventory;
    if ( this.canReachOutcast() && !!items.mirror ) {
      return !!items.boots ? Availability.Available : Availability.Glitches;
    }

    return !!items.boots && items.glove === Glove.Titan ? Availability.Available : Availability.Unavailable;
  }

  private getEastDeathMountainAvailability(): Availability {
    const inventory = this._inventory;
    if ( !(inventory.hasDeathMountainAccess() ) ) {
      return Availability.Unavailable;
    }

    if ( !(inventory.hookshot || inventory.mirror && inventory.hammer)) {
      return Availability.Unavailable;
    }

    return this.getDeathMountainLogicalAccessibility();
  }

  private getMimicCaveAvailability(): Availability {
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

    return this.getDeathMountainLogicalAccessibility();
  }

  private getBonkRocksAvailability(): Availability {
    return this._inventory.boots ? Availability.Available : Availability.Unavailable;
  }

  private getGreenPendantAvailability(): Availability {
    const dungeons = this._dungeons;
    if ( dungeons.hasGreenPendant() ) {
      return Availability.Available;
    }

    return Availability.Unavailable;
  }

  private getSickKidAvailability(): Availability {
    return this._inventory.bottles > 0 ? Availability.Available : Availability.Unavailable;
  }

  private getBridgeAccessAvailability(): Availability {
    return this._inventory.flippers ? Availability.Available : Availability.Glitches;
  }

  private getWaterfallOfWishingAvailability(): Availability {
    if ( this._inventory.flippers ) {
      return Availability.Available;
    }

    return this._inventory.moonPearl ? Availability.Glitches : Availability.Unavailable;
  }

  private getEtherTabletAvailability(): Availability {
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
      return this.getDeathMountainLogicalVisibleAccessibility();
    }

    return this.getDeathMountainLogicalAccessibility();
  }

  private getBombosTabletAvailability(): Availability {
    const inventory = this._inventory;

    if ( !inventory.book ) {
      return Availability.Unavailable;
    }

    const mirrorCaveAccess = this.getMirrorCaveAvailability();
    if ( mirrorCaveAccess !== Availability.Available) {
      return mirrorCaveAccess;
    }

    return this.hasMedallionWeapon() ? Availability.Available : Availability.Visible;
  }

  private getKingZoraAvailability(): Availability {
    return this._inventory.flippers || this._inventory.hasGlove() ? Availability.Available : Availability.Glitches;
  }

  private getOldManAvailability(): Availability {
    if ( !this._inventory.hasDeathMountainAccess() ) {
      return Availability.Unavailable;
    }

    return !!this._inventory.lantern ? Availability.Available : Availability.Glitches;
  }

  private getPotionShopAvailability(): Availability {
    return !!this._inventory.mushroom ? Availability.Available : Availability.Unavailable;
  }

  private getLumberjackAvailability(): Availability {
    return this.isAgahnimDefeated() && !!this._inventory.boots ? Availability.Available : Availability.Visible;
  }

  private getMirrorCaveAvailability(): Availability {
    const inventory = this._inventory;
    if ( !inventory.mirror ) {
      return Availability.Unavailable;
    }

    if (!this.canReachOutcast() && !this.hasSouthDarkWorldFromPyramidAccess()) {
      return Availability.Unavailable;
    }

    return Availability.Available;
  }

  private getGraveyardCliffAvailability(): Availability {
    return this.canReachOutcast() && this._inventory.mirror ? Availability.Available : Availability.Unavailable;
  }

  private getCheckerboardCaveAvailability(): Availability {
    const inventory = this._inventory;
    return !!inventory.flute && !!inventory.mirror && inventory.glove === Glove.Titan ? Availability.Available : Availability.Unavailable;
  }

  private getLibraryAvailability(): Availability {
    return !!this._inventory.boots ? Availability.Available : Availability.Visible;
  }

  private getSpectacleRockAvailability(): Availability {
    if ( !this._inventory.hasDeathMountainAccess() ) {
      return Availability.Unavailable;
    }

    if ( !this._inventory.mirror) {
      return this.getDeathMountainLogicalVisibleAccessibility();
    }

    return this.getDeathMountainLogicalAccessibility();
  }

  private getFloatingIslandAvailability(): Availability {
    const inventory = this._inventory;
    if ( !inventory.hasDeathMountainAccess() ) {
      return Availability.Unavailable;
    }

    if ( !(inventory.hookshot || ( inventory.hammer && inventory.mirror ) ) ) {
      return Availability.Unavailable;
    }

    if ( !(inventory.mirror && inventory.moonPearl && inventory.glove === Glove.Titan)) {
      return this.getDeathMountainLogicalVisibleAccessibility();
    }

    return this.getDeathMountainLogicalAccessibility();
  }

  private getDesertWestLedgeAvailability(): Availability {
    const inventory = this._inventory;
    return inventory.book || inventory.flute && inventory.glove === Glove.Titan ? Availability.Available : Availability.Visible;
  }

  private getLakeHyliaIslandAvailability(): Availability {
    const inventory = this._inventory;
    if ( !inventory.flippers) {
      return Availability.Visible;
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

  private getZoraLedgeAvailability(): Availability {
    if ( this._inventory.flippers ) {
      return Availability.Available;
    }

    return this._inventory.hasGlove() ? Availability.Visible : Availability.GlitchesVisible;
  }

  private getBuriedItemAvailability(): Availability {
    return !!this._inventory.shovel ? Availability.Available : Availability.Unavailable;
  }

  private getSewerEscapeSideRoomAvailability(): Availability {
    if ( this._settings.mode === Mode.Standard || this._inventory.hasGlove() ) {
      return Availability.Available;
    }

    return this._inventory.lantern ? Availability.Possible : Availability.Glitches;
  }

  private getMadBatterAvailability(): Availability {
    const inventory = this._inventory;
    const canReach = inventory.hammer || ( inventory.glove === Glove.Titan && inventory.mirror && inventory.moonPearl );

    if ( !canReach ) {
      return Availability.Unavailable;
    }

    if ( !!inventory.powder ) {
      return Availability.Available;
    }

    return !!inventory.mushroom ? Availability.Glitches : Availability.Unavailable;
  }

  private getDwarfAvailability(): Availability {
    return this._inventory.moonPearl && this._inventory.glove === Glove.Titan ? Availability.Available : Availability.Unavailable;
  }

  private getSewerDarkRoomAvailability(): Availability {
    if ( this._settings.mode === Mode.Standard ) {
      return Availability.Available;
    }

    return this._inventory.lantern ? Availability.Available : Availability.Glitches;
  }

  private getPedestalAvailability(): Availability {
    if ( this._dungeons.hasAllPendants()) {
      return Availability.Available;
    }

    if ( this._inventory.book ) {
      return Availability.Visible;
    }

    return Availability.Unavailable;
  }

  private getDarkMireAvailability(): Availability {
    const items = this._inventory;

    if ( !items.flute && items.glove !== Glove.Titan ) {
      return Availability.Unavailable;
    }

    if ( items.moonPearl ) {
      return Availability.Available;
    }

    return items.mirror ? Availability.Glitches : Availability.Unavailable;
  }

  private getOutcastAvailability(): Availability {
    return this.canReachOutcast() ? Availability.Available : Availability.Unavailable;
  }

  private getSuperBunnyCaveAvailability(): Availability {
    const items = this._inventory;

    if ( !items.hasDeathMountainAccess() ) {
      return Availability.Unavailable;
    }

    if ( items.glove !== Glove.Titan ) {
      return Availability.Unavailable;
    }

    const canTakeBottomRoute = items.hookshot;
    const canTakeTopRoute = items.mirror && items.hammer;
    if ( !(canTakeBottomRoute || canTakeTopRoute) ) {
      return Availability.Unavailable;
    }

    if (!items.moonPearl) {
      return Availability.Glitches;
    }

    return this.getDeathMountainLogicalAccessibility();
  }

  private getSpikeCaveAvailability(): Availability {
    const items = this._inventory;

    if ( !items.hasGlove() ) {
      return Availability.Unavailable;
    }

    if ( !items.hammer && !items.moonPearl ) {
      return Availability.Unavailable;
    }

    if ( !!items.byrna || !!items.cape) {
      return this.getDeathMountainLogicalAccessibility();
    }

    if ( items.bottles > 0 ) {
      return Availability.Possible;
    }

    return Availability.Unavailable;
  }

  private getHypeCaveAvailability(): Availability {
    if ( this.canReachOutcast()) {
      return Availability.Available;
    }

    return this.hasSouthDarkWorldFromPyramidAccess() ?
      Availability.Available : Availability.Unavailable;
  }

  private getHookshotCaveBottomAvailability(): Availability {
    const items = this._inventory;

    if ( !items.moonPearl ) {
      return Availability.Unavailable;
    }

    if ( items.glove !== Glove.Titan ) {
      return Availability.Unavailable;
    }

    const hasHookshotPath = items.hookshot;
    const hasBootsPath = items.mirror && items.hammer && items.boots;

    if ( !hasBootsPath && !hasHookshotPath ) {
      return Availability.Unavailable;
    }

    return this.getDeathMountainLogicalAccessibility();
  }

  private getHookshotCaveTopAvailability(): Availability {
    const items = this._inventory;

    if ( !items.moonPearl ) {
      return Availability.Unavailable;
    }

    if ( items.glove !== Glove.Titan ) {
      return Availability.Unavailable;
    }

    if ( items.hookshot ) {
      return this.getDeathMountainLogicalAccessibility();
    }

    if ( items.boots && items.mirror && items.hammer ) {
      return Availability.Glitches;
    }

    return Availability.Unavailable;
  }

  private getPurpleChestAvailability(): Availability {
    const dwarf = this._itemLocations.get( LocationKey.DwarfEscort );
    // The inventory requirements are met already. Just have to finish a previous quest.
    return dwarf.isOpened ? Availability.Available : Availability.Unavailable;
  }

  private getCatfishAvailability(): Availability {
    const items = this._inventory;
    if ( !items.moonPearl ) {
      return Availability.Unavailable;
    }

    if ( !items.hasGlove()) {
      return Availability.Unavailable;
    }

    const isAgahnimBeaten = this.isAgahnimDefeated();
    if ( isAgahnimBeaten || items.hammer || ( items.glove === Glove.Titan && items.flippers )) {
      return Availability.Available;
    }

    return Availability.Unavailable;
  }

  private getHammerCaveAvailability(): Availability {
    const items = this._inventory;
    return items.moonPearl && items.glove === Glove.Titan && items.hammer ?
      Availability.Available :
      Availability.Unavailable;
  }

  private getBumperCaveAvailability(): Availability {
    if ( !this.canReachOutcast()) {
      return Availability.Unavailable;
    }

    return this._inventory.hasGlove() && this._inventory.cape ? Availability.Available : Availability.Visible;
  }

  private getPyramidAvailability(): Availability {
    if ( this.isAgahnimDefeated()) {
      return Availability.Available;
    }

    const items = this._inventory;
    if ( items.hasGlove() && items.hammer && items.moonPearl ) {
      return Availability.Available;
    }

    if ( items.glove === Glove.Titan && items.moonPearl && items.flippers ) {
      return Availability.Available;
    }

    return Availability.Unavailable;
  }

  private getFatFairyAvailability(): Availability {
    if ( !this._dungeons.hasFatFairyCrystals() ) {
      return Availability.Unavailable;
    }

    const items = this._inventory;
    if ( !items.moonPearl ) {
      return Availability.Unavailable;
    }

    const isAgahnimBeaten = this.isAgahnimDefeated();
    if ( items.hammer && (isAgahnimBeaten || items.hasGlove())) {
      return Availability.Available;
    }

    if ( isAgahnimBeaten && items.mirror && this.canReachOutcast()) {
      return Availability.Available;
    }

    return Availability.Unavailable;
  }

  getAvailability(id: LocationKey): Availability {
    return this._availabilityMap.get(id).call(this);
  }

  isClaimed(id: LocationKey): boolean {
    if ( !this.canToggleOpened(id)) {
      return true;
    }

    return this.itemLocations.get(id).isOpened;
  }

  canToggleOpened(id: LocationKey): boolean {
    return parseInt( this._settings.mode + '', 10 ) !== Mode.Standard ||
      this._standardClaimedLocations.indexOf(id) < 0;
  }

  get itemLocations(): Map<LocationKey, ItemLocation> {
    return this._itemLocations;
  }

  getItemLocation(id: number): ItemLocation {
    return this.itemLocations.get(id);
  }
}
