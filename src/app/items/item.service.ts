import { Injectable } from '@angular/core';

import { ItemKey } from './item-key';
import { Item } from './item';
import { Items } from './item.repository';

import { Mode } from '../settings/mode';
import { Sword } from './sword';
import { Glove } from './glove';

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
        [ItemKey.Tunic, this.setTunic]
      ]
    );
  }

  private _items: Map<ItemKey, Item>;
  private _itemMap: Map<ItemKey, (state: number) => void>;

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
    this.setGeneralItem(ItemKey.SilverArrows, state);
  }

  private setBoomerangs(state: number) {
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

    this.setGeneralItem(ItemKey.Sword, state);
  }

  private setShield(state: number) {
    this.setGeneralItem(ItemKey.Shield, state);
  }

  private setTunic(state: number) {
    this.setGeneralItem(ItemKey.Tunic, state);
  }

  reset(): void {
    this._items.forEach( e => e.state = 0 );
  }

  setItemState(id: number, state: number): void {
    this._itemMap.get(id).call(this, state);
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
