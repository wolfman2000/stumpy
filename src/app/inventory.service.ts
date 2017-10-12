import { Injectable } from '@angular/core';

import { Sword } from './items/sword/sword';
import { Shield } from './items/shield';
import { Tunic } from './items/tunic';

@Injectable()
export class InventoryService {
  constructor() {
    this._sword = Sword.None;
  }

  private _sword: Sword;

  get sword(): Sword {
    return this._sword;
  }
  set sword(sword: Sword) {
    this._sword = sword;
  }

  private _shield: Shield;
  private _tunic: Tunic;

  private _moonPearl: boolean;

  private _bow: boolean;

  get bow(): boolean {
    return this._bow;
  }
  set bow(bow: boolean) {
    this._bow = bow;
  }

  private _silverArrows: boolean;

  private _blueBoomerang: boolean;
  private _redBoomerang: boolean;

  private _hookshot: boolean;
  private _mushroom: boolean;
  private _powder: boolean;

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
  private _ether: boolean;
  private _quake: boolean;

  private _lantern: boolean;
  private _hammer: boolean;
  private _shovel: boolean;
  private _net: boolean;
  private _book: boolean;

  private _bottles: number;
  private _somaria: boolean;
  private _byrna: boolean;
  private _cape: boolean;
  private _mirror: boolean;

  private _boots: boolean;
  private _glove: boolean;
  private _flippers: boolean;
  private _flute: boolean;

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

  toggleBow(): void {
    this.bow = !this.bow;
  }

  toggleFireRod(): void {
    this.fireRod = !this.fireRod;
  }

  toggleIceRod(): void {
    this.iceRod = !this.iceRod;
  }
}
