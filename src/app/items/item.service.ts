import { Injectable } from '@angular/core';

import { ItemKey } from './item-key';
import { Item } from './item';
import { Items } from './item.repository';

import { Difficulty } from '../settings/difficulty';
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
        [ItemKey.SilverArrows, this.getSilverArrowClasses]
      ]
    );
  }

  private _items: Map<ItemKey, Item>;
  private _itemMap: Map<ItemKey, (state: number) => void>;
  private _classMap: Map<ItemKey, () => any>;

  get bombos(): number {
    return this.getItem(ItemKey.Bombos).state;
  }

  get book(): number {
    return this.getItem(ItemKey.Book).state;
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
    this.setGeneralItem(ItemKey.Bow, state);
  }

  private setSilverArrows(state: number) {
    if ( this._settings.mode !== Mode.Swordless && this._settings.isExpertOrInsane()) {
      state = 0;
    }
    this.setGeneralItem(ItemKey.SilverArrows, state);
  }

  private setBoomerangs(state: number) {
    const difficulty = this._settings.difficulty;
    if ( difficulty !== Difficulty.Easy && difficulty !== Difficulty.Normal) {
      this._items.get(ItemKey.Boomerangs).state = 0;
      return;
    }

    this.setGeneralItem(ItemKey.Boomerangs, state);
  }

  private setHookshot(state: number) {
    this.setGeneralItem(ItemKey.Hookshot, state);
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
    const difficulty = this._settings.difficulty;

    if ( logic !== GlitchLogic.Major && state >= 2 ) {
      if ( difficulty === Difficulty.Hard && state >= 3) {
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

    const difficulty = this._settings.difficulty;
    if ( difficulty === Difficulty.Hard && state === 4 ) {
      state = 0;
    } else if ( this._settings.isExpertOrInsane() && state >= 3) {
      state = 0;
    }

    this.setGeneralItem(ItemKey.Sword, state);
  }

  private setShield(state: number) {
    const difficulty = this._settings.difficulty;
    if ( this._settings.isExpertOrInsane() ) {
      state = 0;
    } else if ( difficulty === Difficulty.Hard && state === Shield.Mirror) {
      state = 0;
    }

    this.setGeneralItem(ItemKey.Shield, state);
  }

  private setTunic(state: number) {
    const difficulty = this._settings.difficulty;
    if ( this._settings.isExpertOrInsane() ) {
      state = 0;
    } else if ( difficulty === Difficulty.Hard && state === Tunic.Red) {
      state = 0;
    }

    this.setGeneralItem(ItemKey.Tunic, state);
  }

  private setMagic(state: number) {
    const difficulty = this._settings.difficulty;
    if ( difficulty !== Difficulty.Easy && difficulty !== Difficulty.Normal ) {
      this._items.get(ItemKey.Magic).state = 0;
      return;
    }
    if ( difficulty === Difficulty.Normal && state === 2 ) {
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

    const difficulty = this._settings.difficulty;
    const item = this._items.get(ItemKey.Sword);
    if ( difficulty === Difficulty.Hard && item.state === 4) {
      item.state = 0;
    } else if ( this._settings.isExpertOrInsane() && item.state >= 3) {
      item.state = 0;
    }

    return this.getStandardItemClasses(ItemKey.Sword);
  }

  private getBoomerangClasses(): any {
    const difficulty = this._settings.difficulty;
    if ( difficulty !== Difficulty.Easy && difficulty !== Difficulty.Normal ) {
      return {
        isActive: false,
        boomerang1: true,
        restricted: true
      };
    }

    return this.getStandardItemClasses(ItemKey.Boomerangs);
  }

  private getMagicUpgradeClasses(): any {
    const difficulty = this._settings.difficulty;
    if ( difficulty !== Difficulty.Easy && difficulty !== Difficulty.Normal) {
      return {
        isActive: false,
        magic1: true,
        restricted: true
      };
    }
    const item = this._items.get(ItemKey.Magic);
    if ( difficulty === Difficulty.Normal && item.state === 2) {
      item.state = 0;
    }

    return this.getStandardItemClasses(ItemKey.Magic);
  }

  private getTunicClasses(): any {
    const difficulty = this._settings.difficulty;
    if ( this._settings.isExpertOrInsane() ) {
      return {
        isActive: true,
        tunic1: true,
        restricted: true
      };
    }

    const item = this._items.get(ItemKey.Tunic);
    if ( difficulty === Difficulty.Hard && item.state === 2) {
      item.state = Tunic.Green;
    }

    return this.getStandardItemClasses(ItemKey.Tunic);
  }

  private getShieldClasses(): any {
    const difficulty = this._settings.difficulty;
    if ( this._settings.isExpertOrInsane() ) {
      return {
        isActive: false,
        shield1: true,
        restricted: true
      };
    }

    const item = this._items.get(ItemKey.Shield);
    if ( difficulty === Difficulty.Hard && item.state === Shield.Mirror) {
      item.state = Shield.None;
    }

    return this.getStandardItemClasses(ItemKey.Shield);
  }

  private getBottleClasses(): any {
    const item = this._items.get(ItemKey.Bottle);
    const difficulty = this._settings.difficulty;
    const logic = this._settings.logic;

    if ( logic !== GlitchLogic.Major && item.state >= 2 ) {
      if ( difficulty === Difficulty.Hard && item.state >= 3 ) {
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

  hasMelee(): boolean {
    return this.sword !== Sword.None || !!this.hammer;
  }

  hasMeleeOrBow(): boolean {
    return this.hasMelee() || !!this.bow;
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
    return ( this.hasGlove() && !!this.lantern ) || !!this.flute;
  }
}
