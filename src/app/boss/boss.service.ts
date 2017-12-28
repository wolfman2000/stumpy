import { Injectable } from '@angular/core';

import { Location } from '../dungeon/location';

import { ItemService } from '../items/item.service';
import { SettingsService } from '../settings/settings.service';

@Injectable()
export class BossService {
  constructor(
    private _settings: SettingsService,
    private _items: ItemService
  ) {
    this._bossMap = new Map<Location, () => boolean>(
      [
        [ Location.CastleTower, this.canDefeatAgahnim ],
        [ Location.EasternPalace, this.canDefeatArmosKnights ],
        [ Location.DesertPalace, this.canDefeatLanmolas ],
        [ Location.TowerOfHera, this.canDefeatMoldorm ],
        [ Location.PalaceOfDarkness, this.canDefeatHelmasaurKing ],
        [ Location.SwampPalace, this.canDefeatArrghus ],
        [ Location.SkullWoods, this.canDefeatMothula ],
        [ Location.ThievesTown, this.canDefeatBlind ],
        [ Location.IcePalace, this.canDefeatKholdstare ],
        [ Location.MiseryMire, this.canDefeatVitreous ],
        [ Location.TurtleRock, this.canDefeatTrinexx ],
        [ Location.GanonsTower, this.canDefeatAgahnim ]
      ]
    );
  }

  private _bossMap: Map<Location, () => boolean>;

  private canDefeatAgahnim(): boolean {
    if ( this._items.net ) {
      return true;
    }

    return this._items.hasPrimaryMelee();
  }

  private canDefeatArmosKnights(): boolean {
    const items = this._items;
    return items.hasMeleeOrBow() || items.hasRod() ||
      items.hasCane() || !!items.boomerang || !!items.bomb;
  }

  private canDefeatLanmolas(): boolean {
    const items = this._items;
    return items.hasMeleeOrBow() || items.hasRod() ||
      items.hasCane() || !!items.bomb;
  }

  private canDefeatMoldorm(): boolean {
    return this._items.hasMelee();
  }

  private canDefeatHelmasaurKing(): boolean {
    const items = this._items;
    if ( !!items.hammer ) {
      return true;
    }

    return !!items.bomb && items.hasMeleeOrBow();
  }

  private canDefeatArrghus(): boolean {
    const items = this._items;
    if ( !items.hookshot ) {
      return false;
    }

    return items.hasMeleeOrBow() || items.hasRod() ||
      items.hasCane() || !!items.bomb;
  }

  private canDefeatMothula(): boolean {
    const items = this._items;
    return items.hasMelee() || items.hasCane() || !!items.fireRod;
  }

  private canDefeatBlind(): boolean {
    const items = this._items;
    return items.hasMelee() || items.hasCane();
  }

  private canDefeatKholdstare(): boolean {
    const items = this._items;
    let hasBombos = false;
    if ( !this._settings.isSwordless() ) {
      hasBombos = !!items.bombos;
    }

    const canDefeatBlock = hasBombos || !!items.fireRod;
    const canDefeatCloud = !!items.fireRod || items.hasMelee();

    return canDefeatBlock && canDefeatCloud;
  }

  private canDefeatVitreous(): boolean {
    const items = this._items;
    return items.hasMeleeOrBow() || !!items.bomb;
  }

  private canDefeatTrinexx(): boolean {
    const items = this._items;
    if ( !items.fireRod || !items.iceRod ) {
      return false;
    }

    return items.hasMelee();
  }

  canDefeatBoss(location: Location): boolean {
    return this._bossMap.get(location).call(this);
  }
}
