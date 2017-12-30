import { Injectable } from '@angular/core';

import { ItemKey } from './item-key';
import { Item } from './item';
import { Items } from './item.repository';

import { Mode } from '../settings/mode';
import { GlitchLogic } from '../settings/glitch-logic';

import { Sword } from './sword';
import { Glove } from './glove';
import { Tunic } from './tunic';
import { Shield } from './shield';

import { SettingsService } from '../settings/settings.service';

@Injectable()
export class ItemService {
  constructor(
    private _settings: SettingsService
  ) {
    this._items = Items;

    this._itemMap = new Map<ItemKey, (state: number) => void>(
      [
        [ItemKey.Bow, this.setBow],
        [ItemKey.SilverArrows, this.setSilverArrows],
        [ItemKey.BowAndArrows, this.setBowAndArrows],
        [ItemKey.Boomerangs, this.setBoomerangs],
        [ItemKey.Hookshot, this.setHookshot],
        [ItemKey.Mushroom, this.setMushroom],
        [ItemKey.Powder, this.setPowder],
        [ItemKey.Boots, this.setBoots],
        [ItemKey.Glove, this.setGlove],
        [ItemKey.Flippers, this.setFlippers],
        [ItemKey.MoonPearl, this.setMoonPearl],
        [ItemKey.FireRod, this.setFireRod],
        [ItemKey.IceRod, this.setIceRod],
        [ItemKey.Bombos, this.setBombos],
        [ItemKey.Ether, this.setEther],
        [ItemKey.Quake, this.setQuake],
        [ItemKey.Lantern, this.setLantern],
        [ItemKey.Somaria, this.setSomaria],
        [ItemKey.Byrna, this.setByrna],
        [ItemKey.Cape, this.setCape],
        [ItemKey.Mirror, this.setMirror],
        [ItemKey.Bottle, this.setBottles],
        [ItemKey.Hammer, this.setHammer],
        [ItemKey.Shovel, this.setShovel],
        [ItemKey.Flute, this.setFlute],
        [ItemKey.Net, this.setNet],
        [ItemKey.Book, this.setBook],
        [ItemKey.Sword, this.setSword],
        [ItemKey.Shield, this.setShield],
        [ItemKey.Tunic, this.setTunic],
        [ItemKey.Bomb, this.setBomb],
        [ItemKey.Magic, this.setMagic]
      ]
    );
    this._classMap = new Map<ItemKey, () => any>(
      [
        [ItemKey.Sword, this.getSwordClasses],
        [ItemKey.Boomerangs, this.getBoomerangClasses],
        [ItemKey.Magic, this.getMagicUpgradeClasses],
        [ItemKey.Tunic, this.getTunicClasses],
        [ItemKey.Shield, this.getShieldClasses],
        [ItemKey.Bottle, this.getBottleClasses],
        [ItemKey.SilverArrows, this.getSilverArrowClasses],
        [ItemKey.BowAndArrows, this.getBowAndArrowClasses]
      ]
    );
  }

  private _items: Map<ItemKey, Item>;
  private _itemMap: Map<ItemKey, (state: number) => void>;
  private _classMap: Map<ItemKey, () => any>;

  get bomb(): number {
    return this.getItem(ItemKey.Bomb).state;
  }

  get bombos(): number {
    return this.getItem(ItemKey.Bombos).state;
  }

  get book(): number {
    return this.getItem(ItemKey.Book).state;
  }

  get boomerang(): number {
    return this.getItem(ItemKey.Boomerangs).state;
  }

  get boots(): number {
    return this.getItem(ItemKey.Boots).state;
  }

  get bottles(): number {
    return this.getItem(ItemKey.Bottle).state;
  }

  get bow(): number {
    return this.getItem(ItemKey.Bow).state;
  }

  get byrna(): number {
    return this.getItem(ItemKey.Byrna).state;
  }

  get cape(): number {
    return this.getItem(ItemKey.Cape).state;
  }

  get ether(): number {
    return this.getItem(ItemKey.Ether).state;
  }

  get fireRod(): number {
    return this.getItem(ItemKey.FireRod).state;
  }

  get flippers(): number {
    return this.getItem(ItemKey.Flippers).state;
  }

  get flute(): number {
    return this.getItem(ItemKey.Flute).state;
  }

  get glove(): number {
    return this.getItem(ItemKey.Glove).state;
  }

  get hammer(): number {
    return this.getItem(ItemKey.Hammer).state;
  }

  get hookshot(): number {
    return this.getItem(ItemKey.Hookshot).state;
  }

  get iceRod(): number {
    return this.getItem(ItemKey.IceRod).state;
  }

  get lantern(): number {
    return this.getItem(ItemKey.Lantern).state;
  }

  get mirror(): number {
    return this.getItem(ItemKey.Mirror).state;
  }

  get moonPearl(): number {
    return this.getItem(ItemKey.MoonPearl).state;
  }

  get mushroom(): number {
    return this.getItem(ItemKey.Mushroom).state;
  }

  get net(): number {
    return this.getItem(ItemKey.Net).state;
  }

  get powder(): number {
    return this.getItem(ItemKey.Powder).state;
  }

  get quake(): number {
    return this.getItem(ItemKey.Quake).state;
  }

  get silvers(): number {
    return this.getItem(ItemKey.SilverArrows).state;
  }

  get shield(): number {
    return this.getItem(ItemKey.Shield).state;
  }

  get shovel(): number {
    return this.getItem(ItemKey.Shovel).state;
  }

  get somaria(): number {
    return this.getItem(ItemKey.Somaria).state;
  }

  get sword(): number {
    return this.getItem(ItemKey.Sword).state;
  }

  private setGeneralItem(itemKey: ItemKey, state: number) {
    const item = this._items.get(itemKey);
    item.state = state % item.stateCount;
  }

  private setBow(state: number) {
    state += !!this.silvers ? 2 : 0;
    this.setBowAndArrows(state);
  }

  private setSilverArrows(state: number) {
    if ( this._settings.mode !== Mode.Swordless && this._settings.isExpertOrInsane()) {
      state = 0;
    }

    state = ( state * 2 ) + this.bow;
    this.setBowAndArrows(state);
  }

  private setBowAndArrows(state: number) {
    // Set the bow and arrow items separately.
    if ( state >= 2 && !this._settings.isSwordless() && this._settings.isExpertOrInsane()) {
      state = 0;
    } else {
      state = state % 4;
    }

    const bowState = ( state % 2 === 1 ) ? 1 : 0;
    const silverState = (state >= 2 ) ? 1 : 0;

    this.setGeneralItem(ItemKey.BowAndArrows, state);
    this.setGeneralItem(ItemKey.Bow, bowState);
    this.setGeneralItem(ItemKey.SilverArrows, silverState);
  }

  private setBoomerangs(state: number) {
    if ( this._settings.isHardDifficultyOrHigher() ) {
      this._items.get(ItemKey.Boomerangs).state = 0;
      return;
    }

    this.setGeneralItem(ItemKey.Boomerangs, state);
  }

  private setHookshot(state: number) {
    this.setGeneralItem(ItemKey.Hookshot, state);
  }

  private setBomb(state: number) {
    this.setGeneralItem(ItemKey.Bomb, state);
  }

  private setMushroom(state: number) {
    this.setGeneralItem(ItemKey.Mushroom, state);
  }

  private setPowder(state: number) {
    this.setGeneralItem(ItemKey.Powder, state);
  }

  private setBoots(state: number) {
    this.setGeneralItem(ItemKey.Boots, state);
  }

  private setGlove(state: number) {
    this.setGeneralItem(ItemKey.Glove, state);
  }

  private setFlippers(state: number) {
    this.setGeneralItem(ItemKey.Flippers, state);
  }

  private setMoonPearl(state: number) {
    this.setGeneralItem(ItemKey.MoonPearl, state);
  }

  private setFireRod(state: number) {
    this.setGeneralItem(ItemKey.FireRod, state);
  }

  private setIceRod(state: number) {
    this.setGeneralItem(ItemKey.IceRod, state);
  }

  private setBombos(state: number) {
    this.setGeneralItem(ItemKey.Bombos, state);
  }

  private setEther(state: number) {
    this.setGeneralItem(ItemKey.Ether, state);
  }

  private setQuake(state: number) {
    this.setGeneralItem(ItemKey.Quake, state);
  }

  private setLantern(state: number) {
    this.setGeneralItem(ItemKey.Lantern, state);
  }

  private setSomaria(state: number) {
    this.setGeneralItem(ItemKey.Somaria, state);
  }

  private setByrna(state: number) {
    this.setGeneralItem(ItemKey.Byrna, state);
  }

  private setCape(state: number) {
    this.setGeneralItem(ItemKey.Cape, state);
  }

  private setMirror(state: number) {
    this.setGeneralItem(ItemKey.Mirror, state);
  }

  private setBottles(state: number) {
    const logic = this._settings.logic;

    if ( logic !== GlitchLogic.Major && state >= 2 ) {
      if ( this._settings.isHardDifficulty() && state >= 3) {
        state = 0;
      } else if ( this._settings.isExpertOrInsane() ) {
        state = 0;
      }
    }
    this.setGeneralItem(ItemKey.Bottle, state);
  }

  private setHammer(state: number) {
    this.setGeneralItem(ItemKey.Hammer, state);
  }

  private setShovel(state: number) {
    this.setGeneralItem(ItemKey.Shovel, state);
  }

  private setFlute(state: number) {
    this.setGeneralItem(ItemKey.Flute, state);
  }

  private setNet(state: number) {
    this.setGeneralItem(ItemKey.Net, state);
  }

  private setBook(state: number) {
    this.setGeneralItem(ItemKey.Book, state);
  }

  private setSword(state: number) {
    const mode = this._settings.mode;
    if ( mode === Mode.Swordless ) {
      this._items.get(ItemKey.Sword).state = Sword.None;
      return;
    }

    if ( this._settings.isHardDifficulty() && state === 4 ) {
      state = 0;
    } else if ( this._settings.isExpertOrInsane() && state >= 3) {
      state = 0;
    }

    this.setGeneralItem(ItemKey.Sword, state);
  }

  private setShield(state: number) {
    if ( this._settings.isExpertOrInsane() ) {
      state = 0;
    } else if ( this._settings.isHardDifficulty() && state === Shield.Mirror) {
      state = 0;
    }

    this.setGeneralItem(ItemKey.Shield, state);
  }

  private setTunic(state: number) {
    if ( this._settings.isExpertOrInsane() ) {
      state = 0;
    } else if ( this._settings.isHardDifficulty() && state === Tunic.Red) {
      state = 0;
    }

    this.setGeneralItem(ItemKey.Tunic, state);
  }

  private setMagic(state: number) {
    if ( this._settings.isHardDifficultyOrHigher() ) {
      this._items.get(ItemKey.Magic).state = 0;
      return;
    }
    if ( this._settings.isNormalDifficulty() && state === 2 ) {
      state = 0;
    }

    this.setGeneralItem(ItemKey.Magic, state);
  }

  reset(): void {
    this._items.forEach( e => e.state = 0 );
  }

  setItemState(id: number, state: number): void {
    this._itemMap.get(id).call(this, state);
  }

  private getStandardItemClasses(id: number): any {
    const results = {
      isActive: this.isActive(id)
    };
    results[this.getImage(id)] = true;
    return results;
  }

  private getSwordClasses(): any {
    if ( this._settings.mode === Mode.Swordless ) {
      return {
        isActive: false,
        sword1: true,
        restricted: true
      };
    }

    const item = this._items.get(ItemKey.Sword);
    if ( this._settings.isHardDifficulty() && item.state === 4) {
      item.state = 0;
    } else if ( this._settings.isExpertOrInsane() && item.state >= 3) {
      item.state = 0;
    }

    return this.getStandardItemClasses(ItemKey.Sword);
  }

  private getBoomerangClasses(): any {
    if ( this._settings.isHardDifficultyOrHigher() ) {
      return {
        isActive: false,
        boomerang1: true,
        restricted: true
      };
    }

    return this.getStandardItemClasses(ItemKey.Boomerangs);
  }

  private getMagicUpgradeClasses(): any {
    if ( this._settings.isHardDifficultyOrHigher() ) {
      return {
        isActive: false,
        magic1: true,
        restricted: true
      };
    }
    const item = this._items.get(ItemKey.Magic);
    if ( this._settings.isNormalDifficulty() && item.state === 2) {
      item.state = 0;
    }

    return this.getStandardItemClasses(ItemKey.Magic);
  }

  private getTunicClasses(): any {
    if ( this._settings.isExpertOrInsane() ) {
      return {
        isActive: true,
        tunic1: true,
        restricted: true
      };
    }

    const item = this._items.get(ItemKey.Tunic);
    if ( this._settings.isHardDifficulty() && item.state === 2) {
      item.state = Tunic.Green;
    }

    return this.getStandardItemClasses(ItemKey.Tunic);
  }

  private getShieldClasses(): any {
    if ( this._settings.isExpertOrInsane() ) {
      return {
        isActive: false,
        shield1: true,
        restricted: true
      };
    }

    const item = this._items.get(ItemKey.Shield);
    if ( this._settings.isHardDifficulty() && item.state === Shield.Mirror) {
      item.state = Shield.None;
    }

    return this.getStandardItemClasses(ItemKey.Shield);
  }

  private getBottleClasses(): any {
    const item = this._items.get(ItemKey.Bottle);
    const logic = this._settings.logic;

    if ( logic !== GlitchLogic.Major && item.state >= 2 ) {
      if ( this._settings.isHardDifficulty() && item.state >= 3 ) {
        item.state = 0;
      } else if ( this._settings.isExpertOrInsane() ) {
        item.state = 0;
      }
    }

    return this.getStandardItemClasses(ItemKey.Bottle);
  }

  private getSilverArrowClasses(): any {
    if ( this._settings.isExpertOrInsane() && this._settings.mode !== Mode.Swordless) {
      return {
        isActive: false,
        restricted: true,
        'silver-arrows': true
      };
    }

    return this.getStandardItemClasses(ItemKey.SilverArrows);
  }

  private getBowAndArrowClasses(): any {
    const hasBow = !!this.bow;
    const canUseSilvers = this._settings.isSwordless() || !this._settings.isExpertOrInsane();
    const hasSilvers = !!this.silvers && canUseSilvers;

    const results = {
      isActive: hasBow || hasSilvers
    };

    if ( hasBow && hasSilvers ) {
      results['bow3'] = true;
    } else if ( hasSilvers ) {
      results['bow1'] = true;
    } else {
      results['bow2'] = true;
    }

    return results;
  }

  getItemClasses(id: number): any {
    if ( !this._classMap.has(id)) {
      return this.getStandardItemClasses(id);
    }

    return this._classMap.get(id).call(this);
  }

  isActive(id: number): boolean {
    return this.getItem(id).isActive;
  }

  getImage(id: number): string {
    return this.getItem(id).image;
  }

  getItem(id: number): Item {
    return this._items.get(id);
  }

  hasGlove(): boolean {
    return this.glove > 0;
  }

  hasSword(): boolean {
    return this.sword !== Sword.None;
  }

  hasMelee(): boolean {
    return this.hasSword() || !!this.hammer;
  }

  hasMeleeOrBow(): boolean {
    return this.hasMelee() || !!this.bow;
  }

  hasPrimaryMelee(): boolean {
    if ( this._settings.isSwordless() ) {
      return !!this.hammer;
    }

    return this.hasSword();
  }

  hasCane(): boolean {
    return !!this.somaria || !!this.byrna;
  }

  hasRod(): boolean {
    return !!this.fireRod || !!this.iceRod;
  }

  hasFireSource(): boolean {
    return !!this.fireRod || !!this.lantern;
  }

  hasDarkMireAccess(): boolean {
    return this.glove === Glove.Titan && !!this.flute;
  }

  hasDarkMireMirrorAccess(): boolean {
    return this.hasDarkMireAccess() && !!this.mirror;
  }

  hasDeathMountainAccess(): boolean {
    return this.hasGlove() || !!this.flute;
  }

  hasDeathMountainLogicalAccess(): boolean {
    if ( !!this.flute ) {
      return true;
    }

    return this.hasGlove() && !!this.lantern;
  }
}
