import { Injectable } from '@angular/core';

import { Sword } from './items/sword/sword';
import { Shield } from './items/shield/shield';
import { Tunic } from './items/tunic/tunic';
import { Glove } from './items/glove/glove';

@Injectable()
export class InventoryService {
  constructor() {
    this.sword = Sword.None;
    this.shield = Shield.None;
    this.tunic = Tunic.Green;
    this.glove = Glove.None;
    this.bottles = 0;
  }

  private _sword: Sword;

  get sword(): Sword {
    return this._sword;
  }
  set sword(sword: Sword) {
    this._sword = sword;
  }

  private _shield: Shield;

  get shield(): Shield {
    return this._shield;
  }
  set shield(shield: Shield) {
    this._shield = shield;
  }

  private _tunic: Tunic;

  get tunic(): Tunic {
    return this._tunic;
  }
  set tunic(tunic: Tunic) {
    this._tunic = tunic;
  }

  private _moonPearl: boolean;

  get moonPearl(): boolean {
    return this._moonPearl;
  }
  set moonPearl(moonPearl: boolean) {
    this._moonPearl = moonPearl;
  }

  private _bow: boolean;

  get bow(): boolean {
    return this._bow;
  }
  set bow(bow: boolean) {
    this._bow = bow;
  }

  private _silverArrows: boolean;

  get silverArrows(): boolean {
    return this._silverArrows;
  }
  set silverArrows(silverArrows: boolean) {
    this._silverArrows = silverArrows;
  }

  private _blueBoomerang: boolean;

  get blueBoomerang(): boolean {
    return this._blueBoomerang;
  }
  set blueBoomerang(blueBoomerang: boolean) {
    this._blueBoomerang = blueBoomerang;
  }

  private _redBoomerang: boolean;

  get redBoomerang(): boolean {
    return this._redBoomerang;
  }
  set redBoomerang(redBoomerang: boolean) {
    this._redBoomerang = redBoomerang;
  }

  private _hookshot: boolean;

  get hookshot(): boolean {
    return this._hookshot;
  }
  set hookshot(hookshot: boolean) {
    this._hookshot = hookshot;
  }

  private _mushroom: boolean;

  get mushroom(): boolean {
    return this._mushroom;
  }
  set mushroom(mushroom: boolean) {
    this._mushroom = mushroom;
  }

  private _powder: boolean;

  get powder(): boolean {
    return this._powder;
  }
  set powder(powder: boolean) {
    this._powder = powder;
  }

  private _fireRod: boolean;

  get fireRod(): boolean {
    return this._fireRod;
  }
  set fireRod(fireRod: boolean) {
    this._fireRod = fireRod;
  }

  private _iceRod: boolean;

  get iceRod(): boolean {
    return this._iceRod;
  }
  set iceRod(iceRod: boolean) {
    this._iceRod = iceRod;
  }

  private _bombos: boolean;

  get bombos(): boolean {
    return this._bombos;
  }
  set bombos(bombos: boolean) {
    this._bombos = bombos;
  }

  private _ether: boolean;

  get ether(): boolean {
    return this._ether;
  }
  set ether(ether: boolean) {
    this._ether = ether;
  }

  private _quake: boolean;

  get quake(): boolean {
    return this._quake;
  }
  set quake(quake: boolean) {
    this._quake = quake;
  }

  private _lantern: boolean;

  get lantern(): boolean {
    return this._lantern;
  }
  set lantern(lantern: boolean) {
    this._lantern = lantern;
  }

  private _hammer: boolean;

  get hammer(): boolean {
    return this._hammer;
  }
  set hammer(hammer: boolean) {
    this._hammer = hammer;
  }

  private _shovel: boolean;

  get shovel(): boolean {
    return this._shovel;
  }
  set shovel(shovel: boolean) {
    this._shovel = shovel;
  }

  private _net: boolean;

  get net(): boolean {
    return this._net;
  }
  set net(net: boolean) {
    this._net = net;
  }

  private _book: boolean;

  get book(): boolean {
    return this._book;
  }
  set book(book: boolean) {
    this._book = book;
  }

  private _bottles: number;

  get bottles(): number {
    return this._bottles;
  }
  set bottles(bottles: number) {
    this._bottles = bottles;
  }

  private _somaria: boolean;

  get somaria(): boolean {
    return this._somaria;
  }
  set somaria(somaria: boolean) {
    this._somaria = somaria;
  }

  private _byrna: boolean;

  get byrna(): boolean {
    return this._byrna;
  }
  set byrna(byrna: boolean) {
    this._byrna = byrna;
  }

  private _cape: boolean;

  get cape(): boolean {
    return this._cape;
  }
  set cape(cape: boolean) {
    this._cape = cape;
  }

  private _mirror: boolean;

  get mirror(): boolean {
    return this._mirror;
  }
  set mirror(mirror: boolean) {
    this._mirror = mirror;
  }

  private _boots: boolean;

  get boots(): boolean {
    return this._boots;
  }
  set boots(boots: boolean) {
    this._boots = boots;
  }

  private _glove: Glove;

  get glove(): Glove {
    return this._glove;
  }
  set glove(glove: Glove) {
    this._glove = glove;
  }

  private _flippers: boolean;

  get flippers(): boolean {
    return this._flippers;
  }
  set flippers(flippers: boolean) {
    this._flippers = flippers;
  }

  private _flute: boolean;

  get flute(): boolean {
    return this._flute;
  }
  set flute(flute: boolean) {
    this._flute = flute;
  }

  incrementSword(): void {
    switch ( this.sword ) {
      case Sword.None:
        this.sword = Sword.Wooden;
        break;
      case Sword.Wooden:
        this.sword = Sword.Master;
        break;
      case Sword.Master:
        this.sword = Sword.Tempered;
        break;
      case Sword.Tempered:
        this.sword = Sword.Golden;
        break;
      case Sword.Golden:
        this.sword = Sword.None;
        break;
    }
  }

  incrementShield(): void {
    switch ( this.shield ) {
      case Shield.None:
        this.shield = Shield.Small;
        break;
      case Shield.Small:
        this.shield = Shield.Magic;
        break;
      case Shield.Magic:
        this.shield = Shield.Mirror;
        break;
      case Shield.Mirror:
        this.shield = Shield.None;
        break;
    }
  }

  incrementTunic(): void {
    switch (this.tunic) {
      case Tunic.Green:
        this.tunic = Tunic.Blue;
        break;
      case Tunic.Blue:
        this.tunic = Tunic.Red;
        break;
      case Tunic.Red:
        this.tunic = Tunic.Green;
        break;
    }
  }

  toggleMoonPearl(): void {
    this.moonPearl = !this.moonPearl;
  }

  toggleBow(): void {
    this.bow = !this.bow;
  }

  toggleSilverArrows(): void {
    this.silverArrows = !this.silverArrows;
  }

  toggleBlueBoomerang(): void {
    this.blueBoomerang = !this.blueBoomerang;
  }

  toggleRedBoomerang(): void {
    this.redBoomerang = !this.redBoomerang;
  }

  toggleHookshot(): void {
    this.hookshot = !this.hookshot;
  }

  toggleMushroom(): void {
    this.mushroom = !this.mushroom;
  }

  togglePowder(): void {
    this.powder = !this.powder;
  }

  toggleFireRod(): void {
    this.fireRod = !this.fireRod;
  }

  toggleIceRod(): void {
    this.iceRod = !this.iceRod;
  }

  toggleBombos(): void {
    this.bombos = !this.bombos;
  }

  toggleEther(): void {
    this.ether = !this.ether;
  }

  toggleQuake(): void {
    this.quake = !this.quake;
  }

  toggleLantern(): void {
    this.lantern = !this.lantern;
  }

  toggleHammer(): void {
    this.hammer = !this.hammer;
  }

  toggleShovel(): void {
    this.shovel = !this.shovel;
  }

  toggleNet(): void {
    this.net = !this.net;
  }

  toggleBook(): void {
    this.book = !this.book;
  }

  incrementBottles(): void {
    this.bottles = ++this.bottles % 5;
  }

  toggleSomaria(): void {
    this.somaria = !this.somaria;
  }

  toggleByrna(): void {
    this.byrna = !this.byrna;
  }

  toggleCape(): void {
    this.cape = !this.cape;
  }

  toggleMirror(): void {
    this.mirror = !this.mirror;
  }

  toggleBoots(): void {
    this.boots = !this.boots;
  }

  incrementGlove(): void {
    switch ( this.glove ) {
      case Glove.None:
        this.glove = Glove.Power;
        break;
      case Glove.Power:
        this.glove = Glove.Titan;
        break;
      case Glove.Titan:
        this.glove = Glove.None;
        break;
    }
  }

  toggleFlippers(): void {
    this.flippers = !this.flippers;
  }

  toggleFlute(): void {
    this.flute = !this.flute;
  }

  hasGlove(): boolean {
    return this.glove !== Glove.None;
  }

  hasMelee(): boolean {
    return this.sword !== Sword.None || this.hammer;
  }

  hasMeleeOrBow(): boolean {
    return this.hasMelee() || this.bow;
  }

  hasCane(): boolean {
    return this.somaria || this.byrna;
  }

  hasRod(): boolean {
    return this.fireRod || this.iceRod;
  }

  hasFireSource(): boolean {
    return this.fireRod || this.lantern;
  }

  hasDarkMireAccess(): boolean {
    return this.glove === Glove.Titan && this.flute;
  }

  hasDarkMireMirrorAccess(): boolean {
    return this.hasDarkMireAccess() && this.mirror;
  }

  hasDeathMountainAccess(): boolean {
    return this.hasGlove() || this.flute;
  }

  hasDeathMountainLogicalAccess(): boolean {
    return ( this.hasGlove() && this.lantern ) || this.flute;
  }
}
